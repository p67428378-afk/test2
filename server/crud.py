from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_
from server.models import Seller, Product
from server.schemas import SellerRegister, ProductCreate, ProductUpdate
from server.core.security import get_password_hash


# Seller CRUD
def get_seller_by_email(db: Session, email: str) -> Optional[Seller]:
    return db.query(Seller).filter(Seller.email == email).first()


def get_seller_by_id(db: Session, seller_id: str) -> Optional[Seller]:
    return db.query(Seller).filter(Seller.id == seller_id).first()


def create_seller(db: Session, seller_in: SellerRegister) -> Seller:
    hashed_password = get_password_hash(seller_in.password)
    db_seller = Seller(
        store_name=seller_in.store_name,
        email=seller_in.email,
        phone_number=seller_in.phone_number,
        password_hash=hashed_password,
    )
    db.add(db_seller)
    db.commit()
    db.refresh(db_seller)
    return db_seller


# Product CRUD
def create_product(db: Session, product_in: ProductCreate, seller_id: str) -> Product:
    db_product = Product(
        seller_id=seller_id,
        brand=product_in.brand,
        model=product_in.model,
        processor=product_in.processor,
        ram=product_in.ram,
        storage=product_in.storage,
        gpu=product_in.gpu,
        screen_size=product_in.screen_size,
        condition=product_in.condition,
        price=product_in.price,
        stock_quantity=product_in.stock_quantity,
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_product_by_id(db: Session, product_id: str) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()


def list_products(
    db: Session,
    *,
    brand: Optional[str] = None,
    condition: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    ram: Optional[str] = None,
    storage: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> Tuple[List[Product], int]:
    query = db.query(Product)

    if brand:
        query = query.filter(Product.brand.ilike(f"%{brand}%"))
    if condition:
        query = query.filter(Product.condition.ilike(f"%{condition}%"))
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if ram:
        query = query.filter(Product.ram.ilike(f"%{ram}%"))
    if storage:
        query = query.filter(Product.storage.ilike(f"%{storage}%"))
    if search:
        search_filter = or_(
            Product.brand.ilike(f"%{search}%"),
            Product.model.ilike(f"%{search}%"),
        )
        query = query.filter(search_filter)

    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total


def update_product(
    db: Session, db_product: Product, product_in: ProductUpdate
) -> Product:
    # Use with_for_update to lock the row and ensure atomic update
    db.query(Product).filter(Product.id == db_product.id).with_for_update().first()

    db_product.brand = product_in.brand
    db_product.model = product_in.model
    db_product.processor = product_in.processor
    db_product.ram = product_in.ram
    db_product.storage = product_in.storage
    db_product.gpu = product_in.gpu
    db_product.screen_size = product_in.screen_size
    db_product.condition = product_in.condition
    db_product.price = product_in.price
    db_product.stock_quantity = product_in.stock_quantity

    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, db_product: Product) -> None:
    db.delete(db_product)
    db.commit()
