from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Attendance, Booking, Schedule
from server.schemas import AttendanceCheckInRequest, AttendanceResponse

router = APIRouter(prefix="/api/v1/attendance", tags=["Attendance"])


@router.get("", response_model=List[AttendanceResponse])
@router.get("/", response_model=List[AttendanceResponse], include_in_schema=False)
def list_attendance_records(
    schedule_id: Optional[str] = None,
    booking_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Attendance)
    if schedule_id:
        query = query.filter(Attendance.schedule_id == schedule_id)
    if booking_id:
        query = query.filter(Attendance.booking_id == booking_id)

    query = query.order_by(Attendance.check_in_time.desc())
    return query.offset(skip).limit(limit).all()


@router.post(
    "/check-in", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED
)
def record_check_in(
    check_in_in: AttendanceCheckInRequest,
    db: Session = Depends(get_db),
):
    # Validate booking exists
    booking = db.query(Booking).filter(Booking.id == check_in_in.booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking reservation with id '{check_in_in.booking_id}' not found.",
        )

    if booking.schedule_id != check_in_in.schedule_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking reservation does not belong to the specified tour schedule.",
        )

    if booking.booking_status != "Confirmed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot check in a cancelled booking reservation.",
        )

    # Validate schedule exists
    schedule = db.query(Schedule).filter(Schedule.id == check_in_in.schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with id '{check_in_in.schedule_id}' not found.",
        )

    if check_in_in.attended_count > booking.ticket_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Attended count ({check_in_in.attended_count}) cannot exceed reserved ticket quantity ({booking.ticket_quantity}).",
        )

    attendance = Attendance(
        booking_id=check_in_in.booking_id,
        schedule_id=check_in_in.schedule_id,
        attended_count=check_in_in.attended_count,
        notes=check_in_in.notes,
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return attendance


@router.get("/{id}", response_model=AttendanceResponse)
def get_attendance_record(
    id: str,
    db: Session = Depends(get_db),
):
    record = db.query(Attendance).filter(Attendance.id == id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attendance record with id '{id}' not found.",
        )
    return record
