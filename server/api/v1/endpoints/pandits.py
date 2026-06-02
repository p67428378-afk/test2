
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.db.session import SessionLocal
from server.schemas.pandit import PanditAvailabilityResponse, BlockAvailabilityRequest, DailyBookingResponse
from server.models.pandit import Pandit
from server.models.availability import AvailabilityBlock
from server.models.booking import Booking
from server.models.devotee import Devotee
from datetime import date
from uuid import UUID

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{pandit_id}/availability", response_model=PanditAvailabilityResponse)
def get_pandit_availability(pandit_id: UUID, start_date: date, end_date: date, db: Session = Depends(get_db)):
    pandit = db.query(Pandit).filter(Pandit.id == pandit_id).first()
    if not pandit:
        raise HTTPException(status_code=404, detail="Pandit not found")
    
    # This is a mock implementation. A real implementation would calculate availability.
    return {"pandit_id": pandit_id, "availability": []}

@router.post("/{pandit_id}/availability/block", status_code=201)
def block_pandit_availability(pandit_id: UUID, request: BlockAvailabilityRequest, db: Session = Depends(get_db)):
    pandit = db.query(Pandit).filter(Pandit.id == pandit_id).first()
    if not pandit:
        raise HTTPException(status_code=404, detail="Pandit not found")

    # Check for conflicts with existing bookings
    conflicting_booking = db.query(Booking).filter(
        Booking.pandit_id == pandit_id,
        Booking.start_time < request.end_time,
        Booking.end_time > request.start_time
    ).first()

    if conflicting_booking:
        raise HTTPException(status_code=409, detail="Slot conflicts with an existing booking")

    new_block = AvailabilityBlock(
        pandit_id=pandit_id,
        start_time=request.start_time,
        end_time=request.end_time,
        reason=request.reason
    )
    db.add(new_block)
    db.commit()
    return {"description": "Slot blocked successfully"}

@router.get("/{pandit_id}/bookings", response_model=list[DailyBookingResponse])
def get_pandit_daily_bookings(pandit_id: UUID, date: date, db: Session = Depends(get_db)):
    pandit = db.query(Pandit).filter(Pandit.id == pandit_id).first()
    if not pandit:
        raise HTTPException(status_code=404, detail="Pandit not found")

    bookings = db.query(Booking).join(Devotee).filter(
        Booking.pandit_id == pandit_id,
        func.date(Booking.start_time) == date
    ).all()

    return [
        DailyBookingResponse(
            booking_id=b.id,
            devotee_name=b.devotee.name,
            puja_type=b.puja_type,
            start_time=b.start_time,
            location=b.location
        ) for b in bookings
    ]
