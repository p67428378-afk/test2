
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend import crud, models, schemas
from backend.database import get_db

router = APIRouter()

@router.post("/add", response_model=schemas.CartItem)
def add_to_cart(cart_item: schemas.CartItemCreate, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id=cart_item.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < cart_item.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    db_cart_item = crud.get_cart_item_by_product_id(db, product_id=cart_item.product_id)
    if db_cart_item:
        return crud.update_cart_item_quantity(db=db, db_cart_item=db_cart_item, quantity=cart_item.quantity)
    return crud.create_cart_item(db=db, cart_item=cart_item)

@router.get("/", response_model=list[schemas.CartItem])
def read_cart(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cart_items = db.query(models.CartItem).offset(skip).limit(limit).all()
    return cart_items
