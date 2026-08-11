from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, database
from ..services import product_service

router = APIRouter()

@router.post("/products/", response_model=schemas.CreditCardProductResponse)
def create_product(product: schemas.CreditCardProductCreate, db: Session = Depends(database.get_db)):
    return product_service.create_product(db=db, product=product)

@router.get("/products/", response_model=List[schemas.CreditCardProductResponse])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    products = product_service.get_products(db, skip=skip, limit=limit)
    return products

@router.get("/products/{product_id}", response_model=schemas.CreditCardProductResponse)
def read_product(product_id: str, db: Session = Depends(database.get_db)):
    db_product = product_service.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.put("/products/{product_id}", response_model=schemas.CreditCardProductResponse)
def update_product(product_id: str, product: schemas.CreditCardProductUpdate, db: Session = Depends(database.get_db)):
    db_product = product_service.update_product(db, product_id, product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/products/{product_id}")
def delete_product(product_id: str, db: Session = Depends(database.get_db)):
    db_product = product_service.delete_product(db, product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}
