from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import WebhookRequest

router = APIRouter(prefix="/api/v1/webhooks", tags=["webhooks"])


@router.post("/payment")
def handle_payment_webhook(payload: WebhookRequest, db: Session = Depends(get_db)):
    # In a real app, we would verify the signature and update the order status
    # based on the webhook event type (e.g., payment_intent.succeeded)
    if not payload.id or not payload.type:
        raise HTTPException(status_code=400, detail="Invalid payload")

    return {"received": True}
