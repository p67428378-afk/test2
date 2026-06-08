from datetime import datetime, timedelta
from uuid import UUID

from sqlalchemy.orm import Session

from server import models, schemas


def get_snack(db: Session, snack_id: UUID):
    return db.query(models.Snack).filter(models.Snack.id == snack_id).first()


def get_snack_by_name(db: Session, name: str):
    return db.query(models.Snack).filter(models.Snack.name == name).first()


def get_snacks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Snack).offset(skip).limit(limit).all()


def create_snack(db: Session, snack: schemas.SnackCreate):
    db_snack = models.Snack(name=snack.name)
    db.add(db_snack)
    db.commit()
    db.refresh(db_snack)
    return db_snack


def get_inventory_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.InventoryItem).offset(skip).limit(limit).all()


def get_inventory_item(db: Session, inventory_item_id: UUID):
    return (
        db.query(models.InventoryItem)
        .filter(models.InventoryItem.id == inventory_item_id)
        .first()
    )


def create_inventory_item(db: Session, item: schemas.InventoryItemCreate):
    db_item = models.InventoryItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_inventory_item(
    db: Session, inventory_item_id: UUID, item: schemas.InventoryItemUpdate
):
    db_item = get_inventory_item(db, inventory_item_id)
    if db_item:
        update_data = item.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item


def create_snack_request(db: Session, request: schemas.SnackRequestCreate):
    db_request = models.SnackRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


def create_consumption_record(db: Session, record: schemas.ConsumptionRecordCreate):
    db_record = models.ConsumptionRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def get_expiry_alerts(db: Session, days_threshold: int = 7):
    expiry_threshold_date = datetime.utcnow() + timedelta(days=days_threshold)
    return (
        db.query(models.InventoryItem)
        .filter(models.InventoryItem.expiry_date <= expiry_threshold_date)
        .all()
    )
