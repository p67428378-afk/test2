from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend import schemas, services
from backend.database import get_db

router = APIRouter()

@router.post("/credit_cards/", response_model=schemas.CreditCardResponse, status_code=status.HTTP_201_CREATED)
def create_credit_card(credit_card: schemas.CreditCardCreate, db: Session = Depends(get_db)):
    return services.create_credit_card(db=db, card=credit_card)

@router.get("/credit_cards/{card_id}", response_model=schemas.CreditCardResponse)
def read_credit_card(card_id: str, db: Session = Depends(get_db)):
    db_credit_card = services.get_credit_card(db, card_id=card_id)
    if db_credit_card is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Credit Card not found")
    return db_credit_card

@router.get("/credit_cards/", response_model=List[schemas.CreditCardResponse])
def read_credit_cards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    credit_cards = services.get_credit_cards(db, skip=skip, limit=limit)
    return credit_cards
