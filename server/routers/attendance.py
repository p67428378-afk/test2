from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from server.database import get_db
from server.models import Attendance, Booking
from server.schemas import (
    AttendanceCheckInCreate,
    AttendanceResponse,
)

router = APIRouter(prefix="/api/v1/attendance", tags=["Attendance"])


def _build_attendance_response(attendance: Attendance) -> AttendanceResponse:
    visitor_name = str(attendance.booking.visitor_name) if attendance.booking else None
    return AttendanceResponse(
        id=str(attendance.id),
        booking_id=str(attendance.booking_id),
        schedule_id=str(attendance.schedule_id),
        visitor_name=visitor_name,
        attended_count=int(attendance.attended_count),
        check_in_time=attendance.check_in_time,
        notes=str(attendance.notes) if attendance.notes else None,
        created_at=attendance.created_at,
    )


@router.get("", response_model=List[AttendanceResponse])
def list_attendance(
    schedule_id: Optional[str] = None,
    booking_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List attendance check-in records."""
    query = db.query(Attendance).options(joinedload(Attendance.booking))

    if schedule_id:
        query = query.filter(Attendance.schedule_id == schedule_id)
    if booking_id:
        query = query.filter(Attendance.booking_id == booking_id)

    records = (
        query.order_by(Attendance.check_in_time.desc()).offset(skip).limit(limit).all()
    )
    return [_build_attendance_response(r) for r in records]


@router.post(
    "/check-in", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED
)
def record_check_in(
    check_in_in: AttendanceCheckInCreate, db: Session = Depends(get_db)
):
    """Record visitor check-in attendance against a booking reservation."""
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.schedule))
        .filter(Booking.id == check_in_in.booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking reservation with ID '{check_in_in.booking_id}' not found",
        )

    if booking.booking_status != "Confirmed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot check in booking with status '{booking.booking_status}'. Only 'Confirmed' bookings can check in.",
        )

    if check_in_in.schedule_id and check_in_in.schedule_id != booking.schedule_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provided schedule_id does not match the booking reservation's schedule.",
        )

    if check_in_in.attended_count > int(booking.ticket_quantity):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Attended count ({check_in_in.attended_count}) cannot exceed booked ticket quantity ({booking.ticket_quantity}).",
        )

    attendance = Attendance(
        booking_id=booking.id,
        schedule_id=booking.schedule_id,
        attended_count=check_in_in.attended_count,
        notes=check_in_in.notes,
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    attendance = (
        db.query(Attendance)
        .options(joinedload(Attendance.booking))
        .filter(Attendance.id == attendance.id)
        .first()
    )
    return _build_attendance_response(attendance)


@router.get("/{attendance_id}", response_model=AttendanceResponse)
def get_attendance(attendance_id: str, db: Session = Depends(get_db)):
    """Retrieve an attendance check-in record by ID."""
    attendance = (
        db.query(Attendance)
        .options(joinedload(Attendance.booking))
        .filter(Attendance.id == attendance_id)
        .first()
    )
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attendance record with ID '{attendance_id}' not found",
        )
    return _build_attendance_response(attendance)
