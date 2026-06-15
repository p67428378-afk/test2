from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from uuid import UUID
import re
from server import crud, schemas, models
from server.database import get_db

router = APIRouter()

# Simple email and phone regex
EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"
PHONE_REGEX = r"^\+?[\d\s\-\(\)]+$"


def validate_guest_contact(email: str, phone: str):
    if not re.match(EMAIL_REGEX, email):
        raise HTTPException(status_code=422, detail="Invalid email format")
    if not re.match(PHONE_REGEX, phone):
        raise HTTPException(status_code=422, detail="Invalid phone number format")


@router.post("/reservations", response_model=schemas.ReservationResponse)
def create_reservation(
    reservation: schemas.ReservationCreate, db: Session = Depends(get_db)
):
    # Validate dates
    if reservation.check_in_date < date.today():
        raise HTTPException(
            status_code=400, detail="Check-in date cannot be in the past"
        )
    if reservation.check_in_date >= reservation.check_out_date:
        raise HTTPException(
            status_code=400, detail="Check-in date must be before check-out date"
        )

    # Validate guest contact info
    validate_guest_contact(
        reservation.guest.email_address, reservation.guest.phone_number
    )

    # Check if room exists
    room = crud.get_room(db, reservation.room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # Check if room is available
    available_rooms = crud.get_available_rooms(
        db, reservation.check_in_date, reservation.check_out_date
    )
    if reservation.room_id not in [r.id for r in available_rooms]:
        raise HTTPException(
            status_code=400, detail="Room is not available for the selected dates"
        )

    return crud.create_reservation(db, reservation)


@router.get(
    "/reservations/{reservation_id}", response_model=schemas.ReservationResponse
)
def get_reservation(reservation_id: UUID, db: Session = Depends(get_db)):
    db_reservation = crud.get_reservation(db, reservation_id)
    if not db_reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return db_reservation


@router.put(
    "/reservations/{reservation_id}", response_model=schemas.ReservationResponse
)
def update_reservation(
    reservation_id: UUID,
    reservation_update: schemas.ReservationUpdate,
    db: Session = Depends(get_db),
):
    db_reservation = crud.get_reservation(db, reservation_id)
    if not db_reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    # Validate dates
    if reservation_update.check_in_date < date.today():
        raise HTTPException(
            status_code=400, detail="Check-in date cannot be in the past"
        )
    if reservation_update.check_in_date >= reservation_update.check_out_date:
        raise HTTPException(
            status_code=400, detail="Check-in date must be before check-out date"
        )

    # Validate guest contact info
    validate_guest_contact(
        reservation_update.guest.email_address, reservation_update.guest.phone_number
    )

    # Check if room is available for the new dates (excluding this reservation)
    overlapping = (
        db.query(models.Reservation)
        .filter(
            models.Reservation.room_id == db_reservation.room_id,
            models.Reservation.id != db_reservation.id,
            models.Reservation.status != "Cancelled",
            models.Reservation.check_in_date < reservation_update.check_out_date,
            models.Reservation.check_out_date > reservation_update.check_in_date,
        )
        .first()
    )

    if overlapping:
        raise HTTPException(
            status_code=400, detail="Room is not available for the new dates"
        )

    return crud.update_reservation(db, db_reservation, reservation_update)


@router.get("/reservations", response_model=List[schemas.ReservationResponse])
def list_reservations(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return crud.get_reservations(db, skip=skip, limit=limit, search=search)
