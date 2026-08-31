from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Attendance, Booking, Schedule
from server.schemas import CheckInRequest, AttendanceResponse

router = APIRouter(prefix="/api/v1/attendance", tags=["Attendance"])


@router.get("", response_model=List[AttendanceResponse])
def list_attendance_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    schedule_id: Optional[str] = None,
    booking_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Attendance)
    if schedule_id:
        query = query.filter(Attendance.schedule_id == schedule_id)
    if booking_id:
        query = query.filter(Attendance.booking_id == booking_id)

    return (
        query.order_by(Attendance.check_in_time.desc()).offset(skip).limit(limit).all()
    )


@router.post(
    "/check-in", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED
)
def record_check_in(
    check_in_in: CheckInRequest,
    db: Session = Depends(get_db),
):
    # Validate booking exists
    booking = db.query(Booking).filter(Booking.id == check_in_in.booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking reservation with ID '{check_in_in.booking_id}' not found",
        )

    if booking.booking_status != "Confirmed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot check in booking with status '{booking.booking_status}'. Only Confirmed bookings can be checked in.",
        )

    # Validate schedule exists
    schedule = db.query(Schedule).filter(Schedule.id == check_in_in.schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with ID '{check_in_in.schedule_id}' not found",
        )

    if booking.schedule_id != check_in_in.schedule_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking reservation does not match the provided schedule ID.",
        )

    # Check if attendance already recorded for this booking
    existing_attendance = (
        db.query(Attendance)
        .filter(Attendance.booking_id == check_in_in.booking_id)
        .first()
    )
    if existing_attendance:
        existing_attendance.attended_count = check_in_in.attended_count
        existing_attendance.notes = check_in_in.notes
        existing_attendance.check_in_time = datetime.utcnow()
        db.commit()
        db.refresh(existing_attendance)
        return existing_attendance

    attendance = Attendance(
        booking_id=check_in_in.booking_id,
        schedule_id=check_in_in.schedule_id,
        attended_count=check_in_in.attended_count,
        check_in_time=datetime.utcnow(),
        notes=check_in_in.notes,
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance
