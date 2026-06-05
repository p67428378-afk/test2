
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.app.crud import crud_order
from server.app.schemas.order import Order, OrderCreate
from server.app.db.session import SessionLocal
import uuid

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=Order)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    trader_id = uuid.UUID("f47ac10b-58cc-4372-a567-0e02b2c3d479") # Hardcoded for now
    return crud_order.create_order(db=db, order=order, trader_id=trader_id)

@router.get("/{order_id}", response_model=Order)
def read_order(order_id: uuid.UUID, db: Session = Depends(get_db)):
    db_order = crud_order.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order
