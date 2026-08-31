"""Visitor attendance check-in and tracking endpoints."""

from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Attendance, Booking, Schedule
from server.schemas import AttendanceCheckInCreate, AttendanceResponse

router = APIRouter(prefix="/api/v1/attendance", tags=["Attendance"])


@router.post("/check-in", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def record_check_in(
    check_in_in: AttendanceCheckInCreate,
    db: Session = Depends(get_db),
):
    """Record visitor check-in attendance against a booking reservation."""
    booking = db.query(Booking).filter(Booking.id == check_in_in.booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking reservation not found."
        )

    if booking.booking_status == "Cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot check in a cancelled booking."
        )

    if booking.schedule_id != check_in_in.schedule_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking does not match the specified tour schedule."
        )

    if check_in_in.attended_count > booking.ticket_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Attended count ({check_in_in.attended_count}) exceeds booked ticket quantity ({booking.ticket_quantity})."
        )

    # Check if attendance already recorded for this booking
    existing = db.query(Attendance).filter(Attendance.booking_id == check_in_in.booking_id).first()
    if existing:
        existing.attended_count = check_in_in.attended_count
        existing.notes = check_in_in.notes
        existing.check_in_time = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return existing

    attendance = Attendance(
        booking_id=check_in_in.booking_id,
        schedule_id=check_in_in.schedule_id,
        attended_count=check_in_in.attended_count,
        notes=check_in_in.notes,
        check_in_time=datetime.now(timezone.utc),
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


@router.get("", response_model=List[AttendanceResponse])
def list_attendance_records(
    schedule_id: Optional[str] = Query(None, description="Filter attendance by schedule ID"),
    booking_id: Optional[str] = Query(None, description="Filter attendance by booking ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List visitor attendance check-in records."""
    query = db.query(Attendance)
    if schedule_id:
        query = query.filter(Attendance.schedule_id == schedule_id)
    if booking_id:
        query = query.filter(Attendance.booking_id == booking_id)
    return query.order_by(Attendance.check_in_time.desc()).offset(skip).limit(limit).all()
