from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from server import crud, schemas, database

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("", response_model=schemas.OrderListResponse)
def read_orders(skip: int = 0, limit: int = 20, status: str = None, db: Session = Depends(database.get_db)):
    items, total = crud.get_orders_and_quotes(db, skip=skip, limit=limit, status=status)
    return {"items": items, "total": total, "skip": skip, "limit": limit}

@router.post("", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(database.get_db)):
    try:
        return crud.create_order_or_quote(db, order)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{order_id}", response_model=schemas.OrderResponse)
def update_order(order_id: UUID, order: schemas.OrderUpdate, db: Session = Depends(database.get_db)):
    db_order = crud.update_order_or_quote(db, order_id, order)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order or Quote not found")
    return db_order
