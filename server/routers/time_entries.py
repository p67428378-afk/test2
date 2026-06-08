
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.post("", response_model=schemas.TimeEntry)
def create_time_entry(time_entry: schemas.TimeEntryCreate, db: Session = Depends(get_db)):
    return crud.create_time_entry(db=db, time_entry=time_entry)
