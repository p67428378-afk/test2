from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from server import crud
from server.api.v1.endpoints.orders import create_order
from server.database import get_db
from server.schemas import OrderCreate, OrderResponse

router = APIRouter()


@router.get("", response_model=list[OrderResponse])
def list_pickups(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return crud.list_orders(
        db=db, skip=skip, limit=limit, status="SCHEDULED_FOR_PICKUP"
    )


@router.post("", response_model=OrderResponse)
def schedule_pickup(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
):
    return create_order(order_in=order_in, db=db)
