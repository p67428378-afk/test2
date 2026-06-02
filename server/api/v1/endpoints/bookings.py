
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db
from typing import List
from uuid import UUID
from datetime import date

router = APIRouter()

@router.get("/bookings/daily-agenda", response_model=List[schemas.DailyAgenda])
def read_daily_agenda(pandit_id: UUID, date: date, db: Session = Depends(get_db)):
    agenda_bookings = crud.get_daily_agenda(db, pandit_id=pandit_id, agenda_date=date)
    agenda = []
    for booking in agenda_bookings:
        agenda.append(schemas.DailyAgenda(
            time=booking.booking_time.time(),
            puja_type=booking.puja_type,
            location=booking.location,
            devotee_id=booking.devotee_id
        ))
    return agenda
