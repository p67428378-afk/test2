from sqlalchemy.orm import Session
from .. import models, schemas
from typing import List, Optional

def get_product(db: Session, product_id: str):
    return db.query(models.CreditCardProduct).filter(models.CreditCardProduct.product_id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CreditCardProduct).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.CreditCardProductCreate):
    db_product = models.CreditCardProduct(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: str, product: schemas.CreditCardProductUpdate):
    db_product = db.query(models.CreditCardProduct).filter(models.CreditCardProduct.product_id == product_id).first()
    if db_product:
        for key, value in product.model_dump(exclude_unset=True).items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: str):
    db_product = db.query(models.CreditCardProduct).filter(models.CreditCardProduct.product_id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product
