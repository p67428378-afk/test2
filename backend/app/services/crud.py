from sqlalchemy.orm import Session
from backend.app.models import models
from backend.app.schemas import schemas

def get_credit_card_product(db: Session, product_id: str):
    return db.query(models.CreditCardProduct).filter(models.CreditCardProduct.id == product_id).first()

def get_credit_card_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CreditCardProduct).offset(skip).limit(limit).all()

def create_credit_card_product(db: Session, product: schemas.CreditCardProductCreate):
    db_product = models.CreditCardProduct(name=product.name, description=product.description, features=product.features, eligibility_criteria=product.eligibility_criteria)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
