from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from server.database import get_db
from server.models import Item, Inventory, Warehouse
from server.schemas import ItemCreate, ItemUpdate, ItemResponse, PaginatedItemsResponse
from server.api.v1.auth import get_current_user, RoleChecker

router = APIRouter(prefix="/items", tags=["items"])

# Roles allowed to create/update items
admin_or_manager = RoleChecker(["admin", "manager"])
# Roles allowed to delete items
admin_only = RoleChecker(["admin"])


@router.get("", response_model=PaginatedItemsResponse)
def list_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(Item)

    if search:
        query = query.filter(
            (Item.name.ilike(f"%{search}%"))
            | (Item.sku.ilike(f"%{search}%"))
            | (Item.description.ilike(f"%{search}%"))
        )

    if category:
        query = query.filter(Item.category == category)

    total = query.count()
    items = query.order_by(Item.created_at.desc()).offset(skip).limit(limit).all()

    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(
    item_in: ItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_or_manager),
):
    existing_item = db.query(Item).filter(Item.sku == item_in.sku).first()
    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Item with SKU {item_in.sku} already exists.",
        )

    db_item = Item(
        sku=item_in.sku,
        name=item_in.name,
        description=item_in.description,
        category=item_in.category,
        unit_price=item_in.unit_price,
        reorder_threshold=item_in.reorder_threshold,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    # Seed inventory records with 0 stock for all existing warehouses
    warehouses = db.query(Warehouse).all()
    for wh in warehouses:
        db_inv = Inventory(item_id=db_item.id, warehouse_id=wh.id, current_stock=0)
        db.add(db_inv)
    db.commit()

    return db_item


@router.get("/{id}", response_model=ItemResponse)
def get_item(
    id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    item = db.query(Item).filter(Item.id == id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return item


@router.put("/{id}", response_model=ItemResponse)
def update_item(
    id: str,
    item_in: ItemUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_or_manager),
):
    item = db.query(Item).filter(Item.id == id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    if item_in.sku is not None and item_in.sku != item.sku:
        existing_sku = db.query(Item).filter(Item.sku == item_in.sku).first()
        if existing_sku:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Item with SKU {item_in.sku} already exists.",
            )

    update_data = item_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    id: str, db: Session = Depends(get_db), current_user=Depends(admin_only)
):
    item = db.query(Item).filter(Item.id == id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    db.delete(item)
    db.commit()
    return None
