
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.db.session import SessionLocal
from server.schemas.booking import BookingDetailsResponse
from server.models.booking import Booking
from server.models.devotee import Devotee
from uuid import UUID

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{booking_id}", response_model=BookingDetailsResponse)
def get_booking_details(booking_id: UUID, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    devotee = db.query(Devotee).filter(Devotee.id == booking.devotee_id).first()
    if not devotee:
        # This should ideally not happen if data integrity is maintained
        raise HTTPException(status_code=404, detail="Devotee not found for this booking")

    return {
        "booking_id": booking.id,
        "puja_type": booking.puja_type,
        "start_time": booking.start_time,
        "devotee": devotee
    }
