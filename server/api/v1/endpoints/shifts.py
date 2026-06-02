
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.db.session import SessionLocal
from server.models.shift import Shift
from server.models.pandit import Pandit
from datetime import date
from typing import List
from pydantic import BaseModel

router = APIRouter()

class ShiftResponse(BaseModel):
    date: date
    pandit_name: str
    shift: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[ShiftResponse])
def get_shifts(start_date: date, end_date: date, db: Session = Depends(get_db)):
    shifts = db.query(Shift).join(Pandit).filter(
        Shift.date >= start_date,
        Shift.date <= end_date
    ).all()

    return [
        ShiftResponse(
            date=s.date,
            pandit_name=s.pandit.name,
            shift=s.type
        ) for s in shifts
    ]
