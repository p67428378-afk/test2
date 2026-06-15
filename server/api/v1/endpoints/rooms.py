from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/rooms", response_model=List[schemas.RoomResponse])
def search_rooms(
    check_in_date: date = Query(..., description="Check-in date (YYYY-MM-DD)"),
    check_out_date: date = Query(..., description="Check-out date (YYYY-MM-DD)"),
    room_type: Optional[str] = Query(None, description="Room type (optional)"),
    db: Session = Depends(get_db),
):
    if check_in_date < date.today():
        raise HTTPException(
            status_code=400, detail="Check-in date cannot be in the past"
        )
    if check_in_date >= check_out_date:
        raise HTTPException(
            status_code=400, detail="Check-in date must be before check-out date"
        )

    return crud.get_available_rooms(db, check_in_date, check_out_date, room_type)


@router.post("/rooms", response_model=schemas.RoomResponse)
def create_room(room: schemas.RoomCreate, db: Session = Depends(get_db)):
    db_room = crud.get_room_by_number(db, room.room_number)
    if db_room:
        raise HTTPException(status_code=400, detail="Room number already exists")
    return crud.create_room(db, room)
