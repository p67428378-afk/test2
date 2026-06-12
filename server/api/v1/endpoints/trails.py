from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.get("/trails", response_model=List[schemas.TrailResponse])
def read_trails(db: Session = Depends(get_db)):
    return crud.get_all_trails(db)

@router.post("/trails", response_model=schemas.TrailResponse, status_code=status.HTTP_201_CREATED)
def create_trail(trail: schemas.TrailCreate, db: Session = Depends(get_db)):
    db_trail = crud.get_trail_by_name(db, name=trail.name)
    if db_trail:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Trail name already exists"
        )
    return crud.create_trail(db, trail=trail)
