
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from server import crud, models, schemas
from server.database import get_db
import uuid

router = APIRouter()

@router.get("/", response_model=List[schemas.InventoryItem])
def read_inventory(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    inventory = db.query(models.InventoryItem).options(joinedload(models.InventoryItem.snack)).offset(skip).limit(limit).all()
    for item in inventory:
        item.snack_name = item.snack.name
    return inventory

@router.put("/{inventory_id}/consume", response_model=schemas.ConsumeResponse)
def consume_item(inventory_id: uuid.UUID, consumption: schemas.ConsumptionRecordCreate, db: Session = Depends(get_db)):
    db_item = crud.consume_inventory_item(db, inventory_item_id=inventory_id, quantity_consumed=consumption.quantity_consumed)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found or not enough quantity")
    return {"message": f"Successfully consumed {consumption.quantity_consumed} of item {inventory_id}"}

@router.put("/{inventory_id}", response_model=schemas.UpdateInventoryResponse)
def update_item(inventory_id: uuid.UUID, item: schemas.InventoryItemUpdate, db: Session = Depends(get_db)):
    db_item = crud.update_inventory_item(db, inventory_item_id=inventory_id, item=item)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return {"message": f"Successfully updated item {inventory_id}"}
