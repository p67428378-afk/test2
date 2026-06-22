from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date
import logging
from server import crud, schemas
from server.database import get_db

router = APIRouter()
logger = logging.getLogger(__name__)


def send_email_confirmation(
    client_email: str, client_name: str, session_type: str, booking_date: datetime
):
    # Simulate sending automated email confirmation to client and photographer
    logger.info(f"Sending email confirmation to client: {client_email}")
    logger.info("Sending email confirmation to photographer: photographer@example.com")
    print(
        f"Email sent to {client_email} and photographer@example.com for {session_type} session on {booking_date}"
    )


@router.post(
    "/bookings",
    response_model=schemas.BookingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    # Validate booking date is in the future
    if booking.booking_date.replace(tzinfo=None) < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking date must be in the future",
        )

    # Check if the exact date and time is already booked
    # We can query for any booking at the exact same datetime
    existing_bookings = (
        db.query(crud.models.Booking)
        .filter(crud.models.Booking.booking_date == booking.booking_date)
        .all()
    )
    if existing_bookings:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected date and time is already booked or invalid",
        )

    return crud.create_booking(db, booking)


@router.get("/bookings/availability", response_model=List[str])
def get_availability(
    start_date: str = Query(..., description="Start date in YYYY-MM-DD format"),
    end_date: str = Query(..., description="End date in YYYY-MM-DD format"),
    db: Session = Depends(get_db),
):
    try:
        start_dt = datetime.combine(date.fromisoformat(start_date), datetime.min.time())
        end_dt = datetime.combine(date.fromisoformat(end_date), datetime.max.time())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date range"
        )

    if start_dt > end_dt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date range"
        )

    bookings = crud.get_bookings_by_date_range(db, start_dt, end_dt)
    # Format as ISO 8601 strings with Z suffix
    booked_slots = []
    for b in bookings:
        # Ensure it ends with Z
        dt_str = b.booking_date.isoformat()
        if not dt_str.endswith("Z"):
            dt_str += "Z"
        booked_slots.append(dt_str)
    return booked_slots


@router.post("/bookings/{booking_id}/pay", response_model=schemas.PaymentResponse)
def process_payment(
    booking_id: str, payment: schemas.PaymentRequest, db: Session = Depends(get_db)
):
    booking = crud.get_booking(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )

    # Simulate payment failure for specific mock payment method IDs
    if (
        payment.payment_method_id == "pm_card_charge_declined"
        or "fail" in payment.payment_method_id.lower()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Payment failed"
        )

    # Update booking status to paid
    updated_booking = crud.update_booking_status(
        db,
        booking_id=booking_id,
        status="paid",
        payment_intent_id="pi_mock_" + payment.payment_method_id,
    )

    # Send automated email confirmation
    send_email_confirmation(
        client_email=updated_booking.client_email,
        client_name=updated_booking.client_name,
        session_type=updated_booking.session_type,
        booking_date=updated_booking.booking_date,
    )

    return schemas.PaymentResponse(
        booking_id=booking_id, message="Payment processed successfully", status="paid"
    )
