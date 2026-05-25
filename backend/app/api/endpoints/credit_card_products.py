from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.schemas import schemas
from backend.app.services import crud
from backend.app.db.database import get_db

router = APIRouter(
    prefix="/credit_card_products",
    tags=["credit_card_products"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.CreditCardProduct)
def create_credit_card_product(product: schemas.CreditCardProductCreate, db: Session = Depends(get_db)):
    return crud.create_credit_card_product(db=db, product=product)

@router.get("/", response_model=List[schemas.CreditCardProduct])
def read_credit_card_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crud.get_credit_card_products(db, skip=skip, limit=limit)
    return products

@router.get("/{product_id}", response_model=schemas.CreditCardProduct)
def read_credit_card_product(product_id: str, db: Session = Depends(get_db)):
    db_product = crud.get_credit_card_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Credit Card Product not found")
    return db_product
