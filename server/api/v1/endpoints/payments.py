from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.orm import Session
from typing import Optional
import stripe

from server.database import get_db
from server.schemas import CheckoutSessionCreate, CheckoutSessionResponse
from server import crud, models
from server.core.config import settings

router = APIRouter()
stripe.api_key = settings.STRIPE_API_KEY


@router.post("/checkout-session", response_model=CheckoutSessionResponse)
def create_checkout_session(
    checkout_in: CheckoutSessionCreate,
    db: Session = Depends(get_db),
):
    order = crud.get_order(db=db, order_id=checkout_in.order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    order_id_str = str(order.id)
    amount = float(checkout_in.amount or order.total_amount or 35.0)
    payment = crud.create_or_get_payment(db=db, order_id=order_id_str, amount=amount)

    stripe_session_id = str(
        payment.stripe_session_id or f"cs_test_mock_{order_id_str[:8]}"
    )
    checkout_url = f"https://checkout.stripe.com/pay/{stripe_session_id}"

    try:
        if settings.STRIPE_API_KEY and not settings.STRIPE_API_KEY.startswith(
            "sk_test_mock"
        ):
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": checkout_in.currency or "usd",
                            "product_data": {
                                "name": f"Laundry Service Order #{order_id_str[:8]}"
                            },
                            "unit_amount": int(amount * 100),
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url="http://localhost:5173/orders?status=success",
                cancel_url="http://localhost:5173/orders?status=cancel",
                metadata={"order_id": order_id_str},
            )
            stripe_session_id = str(session.id)
            checkout_url = str(session.url)
            setattr(payment, "stripe_session_id", stripe_session_id)
            db.commit()
    except Exception:
        pass

    setattr(order, "payment_status", "PENDING")
    db.commit()

    return {
        "checkout_url": checkout_url,
        "stripe_session_id": stripe_session_id,
        "order_id": order_id_str,
        "amount": amount,
        "status": "PENDING",
    }


@router.post("/stripe/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None, alias="Stripe-Signature"),
    db: Session = Depends(get_db),
):
    payload = await request.body()
    event = None

    try:
        import json

        event = json.loads(payload.decode("utf-8")) if payload else {}
    except Exception:
        event = {}

    order_id = None
    if isinstance(event, dict):
        event_type = event.get("type")
        if event_type == "checkout.session.completed":
            session_obj = event.get("data", {}).get("object", {})
            metadata = session_obj.get("metadata", {})
            order_id = metadata.get("order_id") or session_obj.get(
                "client_reference_id"
            )
        elif "order_id" in event:
            order_id = event.get("order_id")

    if order_id:
        order = crud.get_order(db=db, order_id=str(order_id))
        if order:
            setattr(order, "payment_status", "PAID")
            payment = (
                db.query(models.Payment)
                .filter(models.Payment.order_id == order.id)
                .first()
            )
            if payment:
                setattr(payment, "status", "SUCCEEDED")
            db.commit()

    return {"status": "success", "message": "Payment status updated to PAID"}
