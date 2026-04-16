from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend import crud, models, schemas
from backend.database import get_db

router = APIRouter()

@router.post("/credit-cards/", response_model=schemas.CreditCard)
def create_credit_card(card: schemas.CreditCardCreate, db: Session = Depends(get_db)):
    return crud.create_credit_card(db=db, card=card)

@router.get("/credit-cards/", response_model=List[schemas.CreditCard])
def read_credit_cards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cards = crud.get_credit_cards(db, skip=skip, limit=limit)
    return cards

@router.get("/credit-cards/{card_id}", response_model=schemas.CreditCard)
def read_credit_card(card_id: str, db: Session = Depends(get_db)):
    db_card = crud.get_credit_card(db, card_id=card_id)
    if db_card is None:
        raise HTTPException(status_code=404, detail="Credit card not found")
    return db_card
