from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.crud import create_order, format_order_response, get_order_by_identifier
from server.database import get_db
from server.schemas import OrderCreate, OrderResponse

router = APIRouter(prefix="/api/v1/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    order = create_order(db=db, order_in=order_in)
    return format_order_response(order)


@router.get("/{order_identifier}", response_model=OrderResponse)
def get_order(order_identifier: str, db: Session = Depends(get_db)):
    order = get_order_by_identifier(db=db, identifier=order_identifier)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_identifier}' not found",
        )
    return format_order_response(order)
