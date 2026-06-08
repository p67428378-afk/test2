from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/", response_model=list[schemas.InventoryItem])
def read_inventory_items(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    items = crud.get_inventory_items(db, skip=skip, limit=limit)
    return items


@router.put("/{inventory_id}", response_model=schemas.InventoryItem)
def update_inventory_item(
    inventory_id: UUID, item: schemas.InventoryItemUpdate, db: Session = Depends(get_db)
):
    db_item = crud.get_inventory_item(db, inventory_item_id=inventory_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return crud.update_inventory_item(db=db, inventory_item_id=inventory_id, item=item)


@router.put("/{inventory_id}/consume", response_model=schemas.ConsumptionRecord)
def consume_inventory_item(
    inventory_id: UUID, request: schemas.ConsumeRequest, db: Session = Depends(get_db)
):
    db_item = crud.get_inventory_item(db, inventory_item_id=inventory_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    if db_item.quantity < request.quantity_consumed:
        raise HTTPException(status_code=400, detail="Not enough quantity to consume")

    db_item.quantity -= request.quantity_consumed
    crud.update_inventory_item(
        db=db,
        inventory_item_id=inventory_id,
        item=schemas.InventoryItemUpdate(quantity=db_item.quantity),
    )

    consumption_record = schemas.ConsumptionRecordCreate(
        inventory_item_id=inventory_id, quantity_consumed=request.quantity_consumed
    )
    return crud.create_consumption_record(db=db, record=consumption_record)
