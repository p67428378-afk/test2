from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from server.database import get_db
from server.models import Attendance, Booking, Schedule, User
from server.schemas import (
    AttendanceCheckIn,
    AttendanceResponse,
    BookingResponse,
    UserResponse,
)
from server.auth import require_roles

router = APIRouter(prefix="/api/v1/attendance", tags=["Attendance"])


def build_attendance_response(
    attendance: Attendance, db: Session
) -> AttendanceResponse:
    visitor_name = None
    ticket_count = None
    booking_res = None

    if attendance.booking:
        ticket_count = attendance.booking.ticket_count
        if attendance.booking.visitor:
            visitor_name = attendance.booking.visitor.full_name
        booking_res = BookingResponse(
            id=attendance.booking.id,
            schedule_id=attendance.booking.schedule_id,
            visitor_id=attendance.booking.visitor_id,
            ticket_count=attendance.booking.ticket_count,
            status=attendance.booking.status,
            created_at=attendance.booking.created_at,
            visitor=UserResponse.model_validate(attendance.booking.visitor)
            if attendance.booking.visitor
            else None,
        )

    return AttendanceResponse(
        id=attendance.id,
        booking_id=attendance.booking_id,
        status=attendance.status,
        checked_in_at=attendance.checked_in_at,
        created_at=attendance.created_at,
        updated_at=attendance.updated_at,
        visitor_name=visitor_name,
        ticket_count=ticket_count,
        booking=booking_res,
    )


@router.get("/schedule/{schedule_id}", response_model=List[AttendanceResponse])
def get_attendance_sheet(
    schedule_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Guide", "Administrator")),
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )

    # Get confirmed bookings for schedule
    bookings = (
        db.query(Booking)
        .options(joinedload(Booking.visitor), joinedload(Booking.attendance))
        .filter(Booking.schedule_id == schedule_id, Booking.status == "Confirmed")
        .all()
    )

    attendance_records = []
    for b in bookings:
        att = b.attendance
        if not att:
            att = Attendance(booking_id=b.id, status="Unchecked")
            db.add(att)
            db.commit()
            db.refresh(att)
        attendance_records.append(att)

    return [build_attendance_response(att, db) for att in attendance_records]


@router.post("/check-in", response_model=AttendanceResponse)
def check_in_visitor(
    checkin_in: AttendanceCheckIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Guide", "Administrator")),
):
    booking = db.query(Booking).filter(Booking.id == checkin_in.booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    att = (
        db.query(Attendance)
        .filter(Attendance.booking_id == checkin_in.booking_id)
        .first()
    )
    if not att:
        att = Attendance(
            booking_id=checkin_in.booking_id,
            status=checkin_in.status,
            checked_in_at=datetime.utcnow()
            if checkin_in.status == "Checked-in"
            else None,
        )
        db.add(att)
    else:
        att.status = checkin_in.status
        if checkin_in.status == "Checked-in":
            att.checked_in_at = datetime.utcnow()
        elif checkin_in.status != "Checked-in":
            att.checked_in_at = None

    db.commit()
    db.refresh(att)
    return build_attendance_response(att, db)
