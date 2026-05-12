
from sqlalchemy.orm import Session
from app.models import item as item_model
from app.schemas import item as item_schema
from uuid import UUID

def get_item(db: Session, item_id: UUID):
    return db.query(item_model.Item).filter(item_model.Item.id == item_id).first()

def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(item_model.Item).offset(skip).limit(limit).all()

def create_item(db: Session, item: item_schema.ItemCreate):
    db_item = item_model.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, item_id: UUID, item: item_schema.ItemUpdate):
    db_item = get_item(db, item_id)
    if db_item:
        update_data = item.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item
