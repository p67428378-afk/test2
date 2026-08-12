from uuid import UUID
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import models_painting as models
from server.schemas_painting import CartItemAddRequest, CartItemOut, CartResponse
from server.services.pricing import calculate_painting_price

router = APIRouter()


def _build_cart_response(cart_id: str, db: Session) -> CartResponse:
    cart_items = (
        db.query(models.CartItem).filter(models.CartItem.cart_id == cart_id).all()
    )
    out_items = []
    subtotal = Decimal("0.0000")
    total_items = 0

    for item in cart_items:
        painting = item.painting
        frame_option = item.frame_option

        item_total = (item.unit_price * item.quantity).quantize(Decimal("0.0001"))
        subtotal += item_total
        total_items += item.quantity

        out_items.append(
            CartItemOut(
                id=item.id,
                cart_id=item.cart_id,
                painting_id=item.painting_id,
                painting_title=painting.title if painting else None,
                painting_image_url=painting.image_url if painting else None,
                frame_option_id=item.frame_option_id,
                frame_name=frame_option.name if frame_option else None,
                custom_width_inches=item.custom_width_inches,
                custom_height_inches=item.custom_height_inches,
                unit_price=item.unit_price,
                quantity=item.quantity,
                total_price=item_total,
            )
        )

    return CartResponse(
        cart_id=cart_id,
        items=out_items,
        subtotal=subtotal,
        total_items=total_items,
    )


@router.get("/cart", response_model=CartResponse)
def get_cart(
    cart_id: str = Query(..., description="Unique cart identifier"),
    db: Session = Depends(get_db),
):
    """
    Retrieve active user shopping cart by cart_id.
    """
    return _build_cart_response(cart_id, db)


@router.post("/cart/items", response_model=CartResponse)
def add_item_to_cart(payload: CartItemAddRequest, db: Session = Depends(get_db)):
    """
    Add standard or custom configured painting to cart.
    """
    painting = (
        db.query(models.Painting)
        .filter(models.Painting.id == payload.painting_id)
        .first()
    )
    if not painting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Painting not found"
        )

    if painting.status != "ACTIVE" or painting.stock_quantity < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Painting is currently unavailable or sold out",
        )

    price_multiplier = Decimal("1.0000")
    flat_fee = Decimal("0.0000")

    if payload.frame_option_id:
        frame_option = (
            db.query(models.FrameOption)
            .filter(models.FrameOption.id == payload.frame_option_id)
            .first()
        )
        if not frame_option:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Frame option not found"
            )
        price_multiplier = frame_option.price_multiplier
        flat_fee = frame_option.flat_fee

    is_valid, validation_error, _, _, calculated_price = calculate_painting_price(
        base_price=painting.base_price,
        custom_width=payload.custom_width_inches,
        custom_height=payload.custom_height_inches,
        price_multiplier=price_multiplier,
        flat_fee=flat_fee,
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=validation_error
        )

    # Check for existing item with identical configuration in cart
    existing_item = (
        db.query(models.CartItem)
        .filter(
            models.CartItem.cart_id == payload.cart_id,
            models.CartItem.painting_id == payload.painting_id,
            models.CartItem.frame_option_id == payload.frame_option_id,
            models.CartItem.custom_width_inches == payload.custom_width_inches,
            models.CartItem.custom_height_inches == payload.custom_height_inches,
        )
        .first()
    )

    if existing_item:
        existing_item.quantity += payload.quantity
    else:
        new_item = models.CartItem(
            cart_id=payload.cart_id,
            painting_id=payload.painting_id,
            frame_option_id=payload.frame_option_id,
            custom_width_inches=payload.custom_width_inches,
            custom_height_inches=payload.custom_height_inches,
            unit_price=calculated_price,
            quantity=payload.quantity,
        )
        db.add(new_item)

    db.commit()
    return _build_cart_response(payload.cart_id, db)


@router.delete("/cart/items/{item_id}", response_model=CartResponse)
def remove_cart_item(
    item_id: UUID, cart_id: str = Query(...), db: Session = Depends(get_db)
):
    """
    Remove an item from the cart.
    """
    item = (
        db.query(models.CartItem)
        .filter(models.CartItem.id == item_id, models.CartItem.cart_id == cart_id)
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found"
        )

    db.delete(item)
    db.commit()
    return _build_cart_response(cart_id, db)


@router.delete("/cart", response_model=CartResponse)
def clear_cart(cart_id: str = Query(...), db: Session = Depends(get_db)):
    """
    Clear all items from a cart.
    """
    db.query(models.CartItem).filter(models.CartItem.cart_id == cart_id).delete()
    db.commit()
    return _build_cart_response(cart_id, db)
