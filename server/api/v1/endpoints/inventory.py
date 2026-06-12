from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from server import schemas, crud
from server.database import get_db

router = APIRouter()

def is_approaching_expiration(harvest_date: datetime, shelf_life: int) -> bool:
    if not harvest_date:
        return False
    # Ensure harvest_date is naive for comparison with datetime.now()
    if harvest_date.tzinfo is not None:
        harvest_date = harvest_date.replace(tzinfo=None)
    expiration_date = harvest_date + timedelta(days=shelf_life)
    remaining_days = (expiration_date - datetime.now()).days
    return remaining_days <= 3

@router.get("/inventory", response_model=List[schemas.InventoryGetResponse])
def list_inventory(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    try:
        items = crud.get_inventory(db, skip=skip, limit=limit, status=status_filter)
        response_items = []
        for item in items:
            flower = crud.get_flower_by_id(db, item.flower_id)
            flower_type = flower.flower_type if flower else "Unknown"
            approaching = is_approaching_expiration(item.harvest_date, item.shelf_life)
            response_items.append(
                schemas.InventoryGetResponse(
                    inventory_id=item.inventory_id,
                    flower_id=item.flower_id,
                    flower_type=flower_type,
                    quantity=item.quantity,
                    harvest_date=item.harvest_date,
                    status=item.status,
                    shelf_life=item.shelf_life,
                    approaching_expiration=approaching,
                    created_at=item.created_at,
                    updated_at=item.updated_at
                )
            )
        return response_items
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.post("/inventory", response_model=schemas.InventoryResponse, status_code=status.HTTP_201_CREATED)
def create_inventory_item(item: schemas.InventoryCreate, db: Session = Depends(get_db)):
    flower = crud.get_flower_by_id(db, item.flower_id)
    if not flower:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid flower_id"
        )
    try:
        return crud.create_inventory_item(db, item)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.put("/inventory/{inventory_id}", response_model=schemas.InventoryResponse)
def update_inventory_item(inventory_id: str, item_update: schemas.InventoryUpdate, db: Session = Depends(get_db)):
    db_item = crud.get_inventory_item(db, inventory_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found"
        )
    try:
        return crud.update_inventory_item(db, db_item, item_update)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
