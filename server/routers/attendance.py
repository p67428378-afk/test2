from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Attendance, Booking
from server.schemas import AttendanceCheckInRequest, AttendanceResponse

router = APIRouter(prefix="/api/v1/attendance", tags=["Attendance"])


@router.get("", response_model=List[AttendanceResponse])
def get_attendance_records(
    schedule_id: Optional[str] = None,
    booking_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(Attendance)
    if schedule_id:
        query = query.filter(Attendance.schedule_id == schedule_id)
    if booking_id:
        query = query.filter(Attendance.booking_id == booking_id)
    records = (
        query.order_by(Attendance.check_in_time.desc()).offset(skip).limit(limit).all()
    )
    return records


@router.get("/{attendance_id}", response_model=AttendanceResponse)
def get_attendance(attendance_id: str, db: Session = Depends(get_db)):
    record = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Attendance record not found"
        )
    return record


@router.post(
    "/check-in",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
)
def record_check_in(
    checkin_in: AttendanceCheckInRequest, db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == checkin_in.booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )

    if booking.booking_status == "Cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot record check-in for a cancelled booking",
        )

    schedule_id = checkin_in.schedule_id or booking.schedule_id

    # Check if attendance already recorded for this booking
    attendance = (
        db.query(Attendance).filter(Attendance.booking_id == booking.id).first()
    )
    if attendance:
        attendance.attended_count = checkin_in.attended_count
        attendance.schedule_id = schedule_id
        if checkin_in.notes is not None:
            attendance.notes = checkin_in.notes
        attendance.check_in_time = datetime.utcnow()
    else:
        attendance = Attendance(
            booking_id=booking.id,
            schedule_id=schedule_id,
            attended_count=checkin_in.attended_count,
            notes=checkin_in.notes,
            check_in_time=datetime.utcnow(),
        )
        db.add(attendance)

    # Mark booking as attended
    booking.booking_status = "ATTENDED"
    db.commit()
    db.refresh(attendance)
    return attendance
