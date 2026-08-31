from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from server.database import get_db
from server.models import Booking, Schedule
from server.schemas import BookingCreate, BookingResponse

router = APIRouter(prefix="/api/v1/bookings", tags=["Bookings"])


@router.get("", response_model=List[BookingResponse])
def list_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    schedule_id: Optional[str] = None,
    visitor_email: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    query = db.query(Booking)
    if schedule_id:
        query = query.filter(Booking.schedule_id == schedule_id)
    if visitor_email:
        query = query.filter(Booking.visitor_email.ilike(f"%{visitor_email}%"))
    if status_filter:
        query = query.filter(Booking.booking_status == status_filter)

    return query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
):
    # Retrieve schedule
    schedule = db.query(Schedule).filter(Schedule.id == booking_in.schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour schedule with ID '{booking_in.schedule_id}' not found",
        )

    if schedule.status != "Published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot book tickets for a schedule with status '{schedule.status}'. Only Published schedules accept bookings.",
        )

    # Compute currently booked tickets
    booked_sum = (
        db.query(func.coalesce(func.sum(Booking.ticket_quantity), 0))
        .filter(
            Booking.schedule_id == schedule.id,
            Booking.booking_status == "Confirmed",
        )
        .scalar()
    )
    currently_booked = int(booked_sum or 0)
    remaining = schedule.max_capacity - currently_booked

    if booking_in.ticket_quantity > remaining:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient ticket capacity available.",
        )

    booking = Booking(
        schedule_id=booking_in.schedule_id,
        visitor_name=booking_in.visitor_name,
        visitor_email=booking_in.visitor_email,
        ticket_quantity=booking_in.ticket_quantity,
        booking_status="Confirmed",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: str,
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with ID '{booking_id}' not found",
        )
    return booking


@router.put("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(
    booking_id: str,
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with ID '{booking_id}' not found",
        )

    booking.booking_status = "Cancelled"
    db.commit()
    db.refresh(booking)
    return booking
