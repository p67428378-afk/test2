import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from server.database import get_db
from server.models import CartItem, Product, User
from server.schemas import CartItemRequest, CartResponse, CartItemResponse
from server.routes import get_current_user

router = APIRouter()


def parse_json_list(val: str) -> list:
    try:
        return json.loads(val)
    except Exception:
        return []


def get_cart_response_for_user(user_id: UUID, db: Session) -> CartResponse:
    items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    cart_items = []
    subtotal = 0.0
    for item in items:
        p = item.product
        img_urls = parse_json_list(p.image_urls)
        img_url = img_urls[0] if img_urls else ""
        price = float(p.price)
        qty = item.quantity
        subtotal += price * qty
        cart_items.append(
            CartItemResponse(
                product_id=p.product_id,
                name=p.name,
                price=price,
                quantity=qty,
                image_url=img_url,
            )
        )
    # We can use a deterministic UUID for the cart based on user_id
    cart_id = uuid4()
    return CartResponse(cart_id=cart_id, items=cart_items, subtotal=subtotal)


@router.get("", response_model=CartResponse)
def get_cart(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return get_cart_response_for_user(current_user.user_id, db)


@router.post("", response_model=CartResponse)
def add_or_update_cart_item(
    req: CartItemRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.product_id == req.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    existing_item = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == current_user.user_id,
            CartItem.product_id == req.product_id,
        )
        .first()
    )

    if existing_item:
        if req.quantity <= 0:
            db.delete(existing_item)
        else:
            existing_item.quantity = req.quantity
    else:
        if req.quantity > 0:
            new_item = CartItem(
                user_id=current_user.user_id,
                product_id=req.product_id,
                quantity=req.quantity,
            )
            db.add(new_item)

    db.commit()
    return get_cart_response_for_user(current_user.user_id, db)
