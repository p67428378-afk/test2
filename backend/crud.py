
from sqlalchemy.orm import Session

from . import models, schemas

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_cart_item_by_product_id(db: Session, product_id: int):
    return db.query(models.CartItem).filter(models.CartItem.product_id == product_id).first()

def create_cart_item(db: Session, cart_item: schemas.CartItemCreate):
    db_cart_item = models.CartItem(**cart_item.dict())
    db.add(db_cart_item)
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item

def update_cart_item_quantity(db: Session, db_cart_item: models.CartItem, quantity: int):
    db_cart_item.quantity += quantity
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item
