from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
import uuid

from server.database import get_db
from server.models import CartItem, Painting
from server.schemas import (
    CartItemCreate,
    CartResponse,
    CartItemAddResponse,
    CartItemResponse,
)

router = APIRouter(prefix="/api/v1/cart", tags=["cart"])


def get_session_id(request: Request, response: Response) -> str:
    session_id = request.cookies.get("session_id")
    if not session_id:
        session_id = request.headers.get("X-Session-ID")
    if not session_id:
        session_id = str(uuid.uuid4())
        response.set_cookie(
            key="session_id", value=session_id, httponly=True, samesite="lax"
        )
    return session_id


@router.get("", response_model=CartResponse)
def get_cart(request: Request, response: Response, db: Session = Depends(get_db)):
    session_id = get_session_id(request, response)
    cart_items = db.query(CartItem).filter(CartItem.session_id == session_id).all()

    items = []
    subtotal = 0.0
    for item in cart_items:
        painting = db.query(Painting).filter(Painting.id == item.painting_id).first()
        if painting:
            price = float(painting.price)
            items.append(
                CartItemResponse(
                    id=item.id,
                    painting_id=item.painting_id,
                    title=painting.title,
                    image_url=painting.image_url,
                    price=price,
                    quantity=item.quantity,
                )
            )
            subtotal += price * item.quantity

    return {"items": items, "subtotal": subtotal, "total": subtotal}


@router.post("/items", response_model=CartItemAddResponse)
def add_cart_item(
    item_in: CartItemCreate,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    session_id = get_session_id(request, response)

    # Check if painting exists
    painting = db.query(Painting).filter(Painting.id == item_in.painting_id).first()
    if not painting:
        raise HTTPException(status_code=404, detail="Painting not found")

    # Check if out of stock
    if painting.stock < 1:
        raise HTTPException(status_code=400, detail="Item is out of stock")

    # Check if already in cart
    existing_item = (
        db.query(CartItem)
        .filter(
            CartItem.session_id == session_id,
            CartItem.painting_id == item_in.painting_id,
        )
        .first()
    )
    if existing_item:
        raise HTTPException(status_code=400, detail="This item is already in your cart")

    # Create cart item
    cart_item = CartItem(
        painting_id=item_in.painting_id, quantity=1, session_id=session_id
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)

    item_resp = CartItemResponse(
        id=cart_item.id,
        painting_id=cart_item.painting_id,
        title=painting.title,
        image_url=painting.image_url,
        price=float(painting.price),
        quantity=cart_item.quantity,
    )

    return {"item": item_resp, "message": "Item added to cart successfully"}


@router.delete("/items/{item_id}")
def remove_cart_item(
    item_id: str, request: Request, response: Response, db: Session = Depends(get_db)
):
    session_id = get_session_id(request, response)
    cart_item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.session_id == session_id)
        .first()
    )

    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart successfully"}
