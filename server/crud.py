from sqlalchemy.orm import Session
from server import models, schemas
from uuid import UUID


def get_products(db: Session, skip: int = 0, limit: int = 20):
    return db.query(models.Product).offset(skip).limit(limit).all()


def get_product(db: Session, product_id: UUID):
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(
        name=product.name,
        price=product.price,
        image_url=product.image_url,
        stock_quantity=product.stock_quantity,
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def create_order(
    db: Session,
    cart_contents: list,
    total_price: float,
    shipping_address: str,
    payment_status: str,
):
    db_order = models.Order(
        cart_contents=cart_contents,
        total_price=total_price,
        shipping_address=shipping_address,
        payment_status=payment_status,
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order
