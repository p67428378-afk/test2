from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
import uuid

from server.database import get_db
from server.models import CartItem, Painting, Order, OrderItem
from server.schemas import (
    CheckoutRequest,
    CheckoutResponse,
    OrderResponse,
    OrderItemResponse,
)
from server.routes.cart import get_session_id

router = APIRouter(prefix="/api/v1/orders", tags=["orders"])


@router.post("/checkout", response_model=CheckoutResponse)
def checkout(
    checkout_in: CheckoutRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    session_id = get_session_id(request, response)

    # Get cart items
    cart_items = db.query(CartItem).filter(CartItem.session_id == session_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Simulate payment gateway integration
    if checkout_in.payment_method_id == "fail":
        raise HTTPException(status_code=402, detail="Payment failed")

    # We will use a transaction block to handle race conditions
    # Lock the paintings to prevent concurrent stock updates
    total_amount = 0.0
    order_items_to_create = []
    paintings_to_update = []

    try:
        for item in cart_items:
            # Lock the painting row
            painting = (
                db.query(Painting)
                .filter(Painting.id == item.painting_id)
                .with_for_update()
                .first()
            )
            if not painting:
                raise HTTPException(
                    status_code=404, detail=f"Painting {item.painting_id} not found"
                )

            if painting.stock < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Item '{painting.title}' is out of stock or has insufficient stock",
                )

            # Decrement stock
            painting.stock -= item.quantity
            paintings_to_update.append(painting)

            price = float(painting.price)
            total_amount += price * item.quantity

            order_items_to_create.append(
                {
                    "painting_id": painting.id,
                    "quantity": item.quantity,
                    "price": price,
                    "title": painting.title,
                }
            )

        # Create the order
        order = Order(
            total_amount=total_amount,
            status="PAID",  # Since payment succeeded
        )
        db.add(order)
        db.flush()  # Get order.id

        # Create order items
        for oi in order_items_to_create:
            order_item = OrderItem(
                order_id=order.id,
                painting_id=oi["painting_id"],
                quantity=oi["quantity"],
                price=oi["price"],
            )
            db.add(order_item)

        # Clear the cart
        for item in cart_items:
            db.delete(item)

        db.commit()

        return {
            "client_secret": f"pi_mock_secret_{uuid.uuid4().hex}",
            "order_id": order.id,
            "status": "succeeded",
            "total_amount": total_amount,
        }

    except HTTPException as he:
        db.rollback()
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"An error occurred during checkout: {str(e)}"
        )


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items = []
    for item in order.items:
        painting = db.query(Painting).filter(Painting.id == item.painting_id).first()
        title = painting.title if painting else "Unknown Painting"
        items.append(
            OrderItemResponse(
                id=item.id,
                painting_id=item.painting_id,
                title=title,
                price=float(item.price),
                quantity=item.quantity,
            )
        )

    return {
        "id": order.id,
        "total_amount": float(order.total_amount),
        "status": order.status,
        "created_at": order.created_at,
        "items": items,
    }
