from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from server.database import get_db
from server.models import Booking, Schedule
from server.schemas import BookingCreate, BookingResponse

router = APIRouter(prefix="/api/v1/bookings", tags=["Bookings"])


@router.get("", response_model=List[BookingResponse])
@router.get("/", response_model=List[BookingResponse], include_in_schema=False)
def list_bookings(
    schedule_id: Optional[str] = None,
    visitor_email: Optional[str] = None,
    booking_status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Booking)
    if schedule_id:
        query = query.filter(Booking.schedule_id == schedule_id)
    if visitor_email:
        query = query.filter(Booking.visitor_email.ilike(f"%{visitor_email}%"))
    if booking_status:
        query = query.filter(Booking.booking_status == booking_status)

    query = query.order_by(Booking.created_at.desc())
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
@router.post(
    "/",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
):
    # Find schedule
    schedule = db.query(Schedule).filter(Schedule.id == booking_in.schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with id '{booking_in.schedule_id}' not found.",
        )

    if schedule.status == "Cancelled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot book tickets for a cancelled tour schedule.",
        )

    # Atomic capacity check
    current_booked = (
        db.query(func.coalesce(func.sum(Booking.ticket_quantity), 0))
        .filter(
            Booking.schedule_id == schedule.id,
            Booking.booking_status == "Confirmed",
        )
        .scalar()
    )
    current_booked_tickets = int(current_booked or 0)
    remaining_capacity = schedule.max_capacity - current_booked_tickets

    if current_booked_tickets + booking_in.ticket_quantity > schedule.max_capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient ticket capacity available. Only {max(0, remaining_capacity)} seats remaining for this tour slot.",
        )

    new_booking = Booking(
        schedule_id=booking_in.schedule_id,
        visitor_name=booking_in.visitor_name,
        visitor_email=booking_in.visitor_email,
        ticket_quantity=booking_in.ticket_quantity,
        booking_status="Confirmed",
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking


@router.get("/{id}", response_model=BookingResponse)
def get_booking(
    id: str,
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking reservation with id '{id}' not found.",
        )
    return booking


@router.put("/{id}/cancel", response_model=BookingResponse)
def cancel_booking(
    id: str,
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking reservation with id '{id}' not found.",
        )

    booking.booking_status = "Cancelled"
    db.commit()
    db.refresh(booking)
    return booking


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(
    id: str,
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking reservation with id '{id}' not found.",
        )
    db.delete(booking)
    db.commit()
    return None
