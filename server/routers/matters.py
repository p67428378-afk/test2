
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.get("", response_model=List[schemas.Matter])
def read_matters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    matters = crud.get_matters(db, skip=skip, limit=limit)
    return matters

@router.post("", response_model=schemas.Matter)
def create_matter(matter: schemas.MatterCreate, db: Session = Depends(get_db)):
    return crud.create_matter(db=db, matter=matter)
