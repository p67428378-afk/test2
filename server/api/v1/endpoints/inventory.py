from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user, get_current_librarian
from typing import List, Optional
from uuid import UUID
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


def _map_inventory_item(item: models.InventoryItem) -> schemas.InventoryItemResponse:
    is_low = item.quantity <= item.low_stock_threshold
    return schemas.InventoryItemResponse(
        item_id=item.item_id,
        name=item.name,
        description=item.description,
        quantity=item.quantity,
        unit=item.unit,
        supplier=item.supplier,
        category=item.category,
        low_stock_threshold=item.low_stock_threshold,
        created_at=item.created_at,
        updated_at=item.updated_at,
        is_low_stock=is_low,
    )


@router.get("/inventory", response_model=List[schemas.InventoryItemResponse])
def read_inventory_items(
    search: Optional[str] = Query(
        None, description="Search by name, supplier, or category"
    ),
    category: Optional[str] = Query(None, description="Filter by category"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    items = crud.get_inventory_items(
        db, search=search, category=category, skip=skip, limit=limit
    )
    return [_map_inventory_item(item) for item in items]


@router.post(
    "/inventory",
    response_model=schemas.InventoryItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_inventory_item(
    item: schemas.InventoryItemCreate,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_item = crud.create_inventory_item(db, item=item)
    # Log transaction
    logger.info(
        f"Inventory transaction: Item '{db_item.name}' (ID: {db_item.item_id}) added with quantity {db_item.quantity} {db_item.unit} by user {current_librarian.email}"
    )
    # Check for low stock alert
    if db_item.quantity <= db_item.low_stock_threshold:
        logger.warning(
            f"LOW STOCK ALERT: Item '{db_item.name}' (ID: {db_item.item_id}) is below threshold! Current: {db_item.quantity}, Threshold: {db_item.low_stock_threshold}"
        )
    return _map_inventory_item(db_item)


@router.get("/inventory/{item_id}", response_model=schemas.InventoryItemResponse)
def read_inventory_item(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_item = crud.get_inventory_item_by_id(db, item_id=item_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found"
        )
    return _map_inventory_item(db_item)


@router.put("/inventory/{item_id}", response_model=schemas.InventoryItemResponse)
def update_inventory_item(
    item_id: UUID,
    item_update: schemas.InventoryItemUpdate,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_item = crud.get_inventory_item_by_id(db, item_id=item_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found"
        )

    old_quantity = db_item.quantity
    updated_item = crud.update_inventory_item(
        db, db_item=db_item, item_update=item_update
    )

    # Log transaction
    logger.info(
        f"Inventory transaction: Item '{updated_item.name}' (ID: {updated_item.item_id}) updated by user {current_librarian.email}. Quantity changed from {old_quantity} to {updated_item.quantity}."
    )

    # Check for low stock alert
    if updated_item.quantity <= updated_item.low_stock_threshold:
        logger.warning(
            f"LOW STOCK ALERT: Item '{updated_item.name}' (ID: {updated_item.item_id}) is below threshold! Current: {updated_item.quantity}, Threshold: {updated_item.low_stock_threshold}"
        )

    return _map_inventory_item(updated_item)


@router.delete("/inventory/{item_id}", status_code=status.HTTP_200_OK)
def delete_inventory_item(
    item_id: UUID,
    db: Session = Depends(get_db),
    current_librarian: models.User = Depends(get_current_librarian),
):
    db_item = crud.get_inventory_item_by_id(db, item_id=item_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found"
        )
    crud.delete_inventory_item(db, db_item=db_item)
    logger.info(
        f"Inventory transaction: Item '{db_item.name}' (ID: {db_item.item_id}) deleted by user {current_librarian.email}."
    )
    return {"message": "Item deleted successfully"}
