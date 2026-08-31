from typing import Optional
from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.orm import Session

from server.crud import (
    add_item_to_cart,
    calculate_cart_details,
    get_or_create_cart,
    remove_cart_item,
    update_cart_item_quantity,
)
from server.database import get_db
from server.schemas import CartItemCreate, CartItemUpdate, CartResponse

router = APIRouter(prefix="/api/v1/cart", tags=["Cart"])


@router.get("", response_model=CartResponse)
def get_cart(
    cart_id: Optional[str] = Query(None, description="Cart ID"),
    x_cart_id: Optional[str] = Header(
        None, alias="X-Cart-ID", description="Cart ID Header"
    ),
    db: Session = Depends(get_db),
):
    target_cart_id = cart_id or x_cart_id
    cart = get_or_create_cart(db=db, cart_id=target_cart_id)
    return calculate_cart_details(cart)


@router.post("/items", response_model=CartResponse)
def add_to_cart(
    item_in: CartItemCreate,
    db: Session = Depends(get_db),
):
    cart = add_item_to_cart(db=db, item_in=item_in)
    return calculate_cart_details(cart)


@router.put("/items/{item_id}")
def update_item(
    item_id: str,
    item_update: CartItemUpdate,
    db: Session = Depends(get_db),
):
    cart_item = update_cart_item_quantity(
        db=db, item_id=item_id, item_update=item_update
    )
    unit_price = cart_item.chocolate.price if cart_item.chocolate else 0.0
    item_subtotal = round(unit_price * cart_item.quantity, 2)
    return {
        "item_id": cart_item.id,
        "cart_id": cart_item.cart_id,
        "quantity": cart_item.quantity,
        "item_subtotal": item_subtotal,
    }


@router.delete("/items/{item_id}")
def delete_item(
    item_id: str,
    db: Session = Depends(get_db),
):
    remove_cart_item(db=db, item_id=item_id)
    return {"message": "Item removed successfully"}
