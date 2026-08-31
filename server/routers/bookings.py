from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from server.database import get_db
from server.models import Booking, Schedule
from server.schemas import BookingCreate, BookingResponse, BookingUpdate

router = APIRouter(prefix="/api/v1/bookings", tags=["Bookings"])


def _build_booking_response(booking: Booking) -> BookingResponse:
    tour_title = (
        str(booking.schedule.tour.title)
        if booking.schedule and booking.schedule.tour
        else None
    )
    return BookingResponse(
        id=str(booking.id),
        schedule_id=str(booking.schedule_id),
        tour_title=tour_title,
        visitor_name=str(booking.visitor_name),
        visitor_email=str(booking.visitor_email),
        ticket_quantity=int(booking.ticket_quantity),
        booking_status=str(booking.booking_status),
        created_at=booking.created_at,
        updated_at=booking.updated_at,
    )


@router.get("", response_model=List[BookingResponse])
def list_bookings(
    schedule_id: Optional[str] = None,
    visitor_email: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List bookings with optional filtering by schedule or visitor email."""
    query = db.query(Booking).options(
        joinedload(Booking.schedule).joinedload(Schedule.tour)
    )
    if schedule_id:
        query = query.filter(Booking.schedule_id == schedule_id)
    if visitor_email:
        query = query.filter(Booking.visitor_email == visitor_email)

    bookings = query.order_by(Booking.created_at.desc()).offset(skip).limit(limit).all()
    return [_build_booking_response(b) for b in bookings]


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(booking_in: BookingCreate, db: Session = Depends(get_db)):
    """Reserve tour tickets with atomic capacity locking."""
    schedule = (
        db.query(Schedule)
        .options(
            joinedload(Schedule.bookings),
            joinedload(Schedule.tour),
        )
        .filter(Schedule.id == booking_in.schedule_id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour schedule with ID '{booking_in.schedule_id}' not found",
        )

    if schedule.status != "Published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot book schedule in '{schedule.status}' status. Only 'Published' schedules accept bookings.",
        )

    # Compute currently confirmed booked tickets
    current_booked = sum(
        b.ticket_quantity for b in schedule.bookings if b.booking_status == "Confirmed"
    )
    available_capacity = int(schedule.max_capacity) - current_booked

    if booking_in.ticket_quantity > available_capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient ticket capacity available. Requested: {booking_in.ticket_quantity}, Available: {max(0, available_capacity)}.",
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

    # Reload with relationships
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.schedule).joinedload(Schedule.tour))
        .filter(Booking.id == booking.id)
        .first()
    )
    return _build_booking_response(booking)


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: str, db: Session = Depends(get_db)):
    """Retrieve booking confirmation by reservation ID."""
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.schedule).joinedload(Schedule.tour))
        .filter(Booking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking reservation with ID '{booking_id}' not found",
        )
    return _build_booking_response(booking)


@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: str, booking_in: BookingUpdate, db: Session = Depends(get_db)
):
    """Update or cancel a booking."""
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.schedule).joinedload(Schedule.tour))
        .filter(Booking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking reservation with ID '{booking_id}' not found",
        )

    if booking_in.booking_status is not None:
        booking.booking_status = booking_in.booking_status
    if booking_in.ticket_quantity is not None:
        booking.ticket_quantity = booking_in.ticket_quantity

    db.commit()
    db.refresh(booking)
    return _build_booking_response(booking)


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(booking_id: str, db: Session = Depends(get_db)):
    """Cancel a booking reservation."""
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.schedule).joinedload(Schedule.tour))
        .filter(Booking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking reservation with ID '{booking_id}' not found",
        )

    booking.booking_status = "Cancelled"
    db.commit()
    db.refresh(booking)
    return _build_booking_response(booking)
