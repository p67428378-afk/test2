from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from server.database import get_db
from server.models import Booking, Schedule
from server.schemas import BookingCreate, BookingUpdate, BookingResponse

router = APIRouter(prefix="/api/v1/bookings", tags=["Bookings"])


@router.get("", response_model=List[BookingResponse])
def get_bookings(
    schedule_id: Optional[str] = None,
    visitor_email: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(Booking)
    if schedule_id:
        query = query.filter(Booking.schedule_id == schedule_id)
    if visitor_email:
        query = query.filter(Booking.visitor_email == visitor_email)
    bookings = query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()
    return bookings


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )
    return booking


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking_in: BookingCreate, db: Session = Depends(get_db)):
    schedule = db.query(Schedule).filter(Schedule.id == booking_in.schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule slot not found"
        )

    if schedule.status == "Cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot book tickets for a cancelled tour schedule",
        )

    # Calculate booked tickets count
    currently_booked = (
        db.query(func.coalesce(func.sum(Booking.ticket_quantity), 0))
        .filter(
            Booking.schedule_id == schedule.id,
            Booking.booking_status != "Cancelled",
        )
        .scalar()
        or 0
    )

    remaining_capacity = schedule.max_capacity - currently_booked
    if booking_in.ticket_quantity > remaining_capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient capacity: Requested {booking_in.ticket_quantity} tickets but only {max(0, remaining_capacity)} seats remaining.",
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


@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: str, booking_in: BookingUpdate, db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )

    if (
        booking_in.ticket_quantity is not None
        and booking_in.ticket_quantity != booking.ticket_quantity
    ):
        schedule = db.query(Schedule).filter(Schedule.id == booking.schedule_id).first()
        currently_booked = (
            db.query(func.coalesce(func.sum(Booking.ticket_quantity), 0))
            .filter(
                Booking.schedule_id == schedule.id,
                Booking.booking_status != "Cancelled",
                Booking.id != booking.id,
            )
            .scalar()
            or 0
        )
        remaining = schedule.max_capacity - currently_booked
        if booking_in.ticket_quantity > remaining:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient capacity: Cannot update to {booking_in.ticket_quantity} tickets, only {max(0, remaining)} seats remaining.",
            )
        booking.ticket_quantity = booking_in.ticket_quantity

    if booking_in.visitor_name is not None:
        booking.visitor_name = booking_in.visitor_name
    if booking_in.visitor_email is not None:
        booking.visitor_email = booking_in.visitor_email
    if booking_in.booking_status is not None:
        booking.booking_status = booking_in.booking_status

    db.commit()
    db.refresh(booking)
    return booking


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )
    booking.booking_status = "Cancelled"
    db.commit()
    db.refresh(booking)
    return booking
