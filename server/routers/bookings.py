"""Visitor tour ticket reservation and capacity enforcement endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Booking, Schedule
from server.schemas import BookingCreate, BookingResponse

router = APIRouter(prefix="/api/v1/bookings", tags=["Bookings"])


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
):
    """Reserve tickets for a tour schedule with atomic capacity validation."""
    if booking_in.ticket_quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket quantity must be at least 1."
        )

    # Fetch schedule
    schedule = db.query(Schedule).filter(Schedule.id == booking_in.schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Referenced tour schedule not found."
        )

    if schedule.status == "Cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot book tickets for a cancelled tour schedule."
        )

    # Capacity enforcement: sum of confirmed tickets
    total_confirmed_tickets = sum(
        b.ticket_quantity for b in schedule.bookings if b.booking_status == "Confirmed"
    )

    if total_confirmed_tickets + booking_in.ticket_quantity > schedule.max_capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient ticket capacity available."
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


@router.get("/{id}", response_model=BookingResponse)
def get_booking(
    id: str,
    db: Session = Depends(get_db),
):
    """Retrieve booking confirmation by reservation ID."""
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking reservation not found."
        )
    return booking


@router.get("", response_model=List[BookingResponse])
def list_bookings(
    schedule_id: Optional[str] = Query(None, description="Filter bookings by schedule ID"),
    visitor_email: Optional[str] = Query(None, description="Filter bookings by visitor email"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List bookings with optional filters."""
    query = db.query(Booking)
    if schedule_id:
        query = query.filter(Booking.schedule_id == schedule_id)
    if visitor_email:
        query = query.filter(Booking.visitor_email == visitor_email)
    return query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()


@router.put("/{id}/cancel", response_model=BookingResponse)
def cancel_booking(
    id: str,
    db: Session = Depends(get_db),
):
    """Cancel a visitor booking reservation."""
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking reservation not found."
        )

    booking.booking_status = "Cancelled"
    db.commit()
    db.refresh(booking)
    return booking
