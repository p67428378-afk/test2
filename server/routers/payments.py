"""
Module: server.routers.payments
Purpose: Payments router.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.order import Order, Payment
from server.models.user import User
from server.routers.auth import get_current_user
from server.schemas.payment import PaymentCreate, PaymentResponse

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def process_payment(
    payload: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Process payment for an order.
    """
    order = db.query(Order).filter(Order.id == payload.order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    # Check authorization
    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized to pay for this order",
        )

    # Check if already paid
    if order.payment_status == "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order has already been paid",
        )

    # Check amount mismatch
    if abs(float(order.total_amount) - payload.amount) > 0.01:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment amount mismatch. Expected {order.total_amount}, got {payload.amount}",
        )

    # Process payment (mock success)
    transaction_id = f"tx_{uuid.uuid4().hex[:12]}"

    db_payment = Payment(
        order_id=order.id,
        amount=payload.amount,
        payment_method=payload.payment_method,
        status="completed",
        transaction_id=transaction_id,
    )

    # Update order payment status
    order.payment_status = "paid"  # type: ignore

    db.add(db_payment)
    db.add(order)
    db.commit()
    db.refresh(db_payment)

    return db_payment
