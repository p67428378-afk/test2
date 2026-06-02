
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db
from typing import List
from uuid import UUID

router = APIRouter()

@router.get("/pandits/{pandit_id}/availability", response_model=List[schemas.Availability])
def read_pandit_availability(pandit_id: UUID, month: int, year: int, db: Session = Depends(get_db)):
    availability = crud.get_pandit_availability(db, pandit_id=pandit_id, month=month, year=year)
    return availability

@router.post("/pandits/{pandit_id}/availability", response_model=dict)
def update_pandit_availability(pandit_id: UUID, availability_update: schemas.AvailabilityUpdate, db: Session = Depends(get_db)):
    return crud.update_pandit_availability(db, pandit_id=pandit_id, availability_update=availability_update)

@router.get("/pandits/{pandit_id}/shifts", response_model=List[schemas.Shift])
def read_pandit_shifts(pandit_id: UUID, db: Session = Depends(get_db)):
    shifts = crud.get_pandit_shifts(db, pandit_id=pandit_id)
    return shifts
