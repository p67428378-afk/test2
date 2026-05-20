from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.db.session import SessionLocal
from app.models.booking import Booking
from app.models.guest import Guest
from app.models.room import Room

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_bookings(
    guestName: Optional[str] = None,
    roomNumber: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Booking)
    if guestName:
        # This is a simplification. A real implementation would need to handle names more robustly.
        query = query.join(Guest).filter(Guest.first_name + " " + Guest.last_name == guestName)
    if roomNumber:
        query = query.join(Room).filter(Room.room_number == roomNumber)
    if status:
        query = query.filter(Booking.status == status)
    bookings = query.all()
    return {"bookings": bookings}

@router.post("/")
def create_booking(booking: dict, db: Session = Depends(get_db)):
    # A more robust implementation would validate the input and check if guest and room exist
    new_booking = Booking(
        guest_id=booking.get("guest_id"),
        room_id=booking.get("room_id"),
        check_in_date=booking.get("check_in_date"),
        check_out_date=booking.get("check_out_date"),
        status="confirmed"
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

@router.get("/{id}")
def get_booking(id: uuid.UUID, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.put("/{id}")
def update_booking(id: uuid.UUID, booking_update: dict, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking.status = booking_update.get("status", booking.status)
    db.commit()
    db.refresh(booking)
    return booking

@router.delete("/{id}")
def cancel_booking(id: uuid.UUID, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    db.delete(booking)
    db.commit()
    return {"message": f"Booking {id} cancelled"}
