"""Photographer management, schedule, availability, and slot queries."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from server.auth import get_optional_current_user
from server.crud import (
    get_photographer_by_id,
    get_photographer_slots,
    get_photographers,
    set_photographer_availability,
)
from server.database import get_db
from server.models import Availability, User
from server.schemas import (
    AvailabilityCreate,
    AvailabilityOut,
    PhotographerOut,
    TimeSlotOut,
)

router = APIRouter(prefix="/api/v1/photographers", tags=["photographers"])


@router.get("", response_model=List[PhotographerOut])
def list_photographers(
    active: bool = Query(True, description="Filter active photographers"),
    db: Session = Depends(get_db),
):
    return get_photographers(db, active_only=active)


@router.get("/{id}", response_model=PhotographerOut)
def get_photographer(id: str, db: Session = Depends(get_db)):
    photog = get_photographer_by_id(db, id)
    if not photog:
        raise HTTPException(status_code=404, detail="Photographer not found")
    return photog


@router.get("/{id}/slots", response_model=List[TimeSlotOut])
def get_slots(
    id: str,
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    db: Session = Depends(get_db),
):
    return get_photographer_slots(db, id, date)


@router.get("/{id}/availability")
def get_availability(id: str, db: Session = Depends(get_db)):
    avails = (
        db.query(Availability)
        .filter(Availability.photographer_id == id)
        .order_by(Availability.created_at.desc())
        .all()
    )
    return avails


@router.post("/{id}/availability", response_model=AvailabilityOut)
def update_availability(
    id: str,
    avail_in: AvailabilityCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    return set_photographer_availability(db, id, avail_in)
