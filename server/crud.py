
from sqlalchemy.orm import Session
from . import models, schemas
import uuid
from datetime import datetime, timedelta

def get_inventory(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.InventoryItem).offset(skip).limit(limit).all()

def create_snack_request(db: Session, request: schemas.SnackRequestCreate):
    db_request = models.SnackRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def consume_inventory_item(db: Session, inventory_item_id: uuid.UUID, quantity_consumed: int):
    db_item = db.query(models.InventoryItem).filter(models.InventoryItem.id == inventory_item_id).first()
    if db_item:
        if db_item.quantity >= quantity_consumed:
            db_item.quantity -= quantity_consumed
            db_consumption = models.ConsumptionRecord(
                inventory_item_id=inventory_item_id, 
                quantity_consumed=quantity_consumed
            )
            db.add(db_consumption)
            db.commit()
            db.refresh(db_item)
            return db_item
    return None

def update_inventory_item(db: Session, inventory_item_id: uuid.UUID, item: schemas.InventoryItemUpdate):
    db_item = db.query(models.InventoryItem).filter(models.InventoryItem.id == inventory_item_id).first()
    if db_item:
        update_data = item.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def get_expiry_alerts(db: Session, days_threshold: int = 7):
    future_date = datetime.utcnow() + timedelta(days=days_threshold)
    return db.query(models.InventoryItem).filter(
        models.InventoryItem.expiry_date <= future_date
    ).all()
