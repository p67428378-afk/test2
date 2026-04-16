
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    # Add some dummy products
    if not db.query(models.Product).first():
        db.add(models.Product(id=1, name="Sculptural Minimalist Lamp", price=185.00, stock=10))
        db.add(models.Product(id=2, name="Charcoal Vase", price=95.00, stock=0))
        db.commit()
    db.close()

@app.post("/api/cart/add", response_model=schemas.CartItem)
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

@app.get("/api/cart/", response_model=list[schemas.CartItem])
def read_cart(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cart_items = db.query(models.CartItem).offset(skip).limit(limit).all()
    return cart_items
