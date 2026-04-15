
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend import crud, schemas
from backend.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.CreditCardOffering])
def read_credit_card_offerings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    offerings = crud.get_credit_card_offerings(db, skip=skip, limit=limit)
    return offerings

@router.post("/", response_model=schemas.CreditCardOffering)
def create_credit_card_offering(credit_card: schemas.CreditCardOfferingCreate, db: Session = Depends(get_db)):
    return crud.create_credit_card_offering(db=db, credit_card=credit_card)
