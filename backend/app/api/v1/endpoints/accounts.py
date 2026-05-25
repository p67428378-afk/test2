
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.Account])
def read_accounts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    accounts = crud.get_accounts(db, skip=skip, limit=limit)
    return accounts
