
from sqlalchemy.orm import Session
from server.app.models.order import Order
from server.app.schemas.order import OrderCreate
import uuid

def get_order(db: Session, order_id: uuid.UUID):
    return db.query(Order).filter(Order.id == order_id).first()

def create_order(db: Session, order: OrderCreate, trader_id: uuid.UUID):
    db_order = Order(**order.dict(), trader_id=trader_id, status="PENDING")
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order
