from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
import logging
from server import schemas, crud, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user

router = APIRouter()
logger = logging.getLogger("payments")


# Simulated Secure Payment Gateway Client (Stripe/PayPal Mock)
class SecurePaymentGateway:
    @staticmethod
    def process_charge(amount: float, method: str, card_details: dict = None) -> dict:
        # Simulate secure API call to Stripe/PayPal
        logger.info(f"Initiating secure payment of ${amount} via {method}...")

        if method == "credit_card":
            if not card_details or not card_details.get("card_number"):
                return {"success": False, "error": "Missing card details"}
            # Simulate card validation
            card_num = card_details["card_number"]
            if card_num.startswith("4111") or card_num.startswith("1234"):
                return {
                    "success": True,
                    "transaction_id": f"ch_stripe_{uuid.uuid4().hex[:16]}",
                    "gateway": "Stripe",
                }
            else:
                return {"success": False, "error": "Card declined by issuer"}
        elif method == "paypal":
            return {
                "success": True,
                "transaction_id": f"pay_paypal_{uuid.uuid4().hex[:16]}",
                "gateway": "PayPal",
            }
        return {"success": False, "error": "Unsupported payment method"}


@router.post("/payments", response_model=schemas.PaymentResponse)
def process_payment(
    payment_in: schemas.PaymentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    booking = crud.get_booking(db, booking_id=payment_in.booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )

    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to pay for this booking",
        )

    # Check amount mismatch
    if abs(float(booking.total_price) - payment_in.amount) > 0.01:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment processing failed or amount mismatch",
        )

    # Call our simulated secure payment gateway
    card_details = (
        {
            "card_number": payment_in.card_number,
            "cvv": payment_in.cvv,
            "expiry_date": payment_in.expiry_date,
        }
        if payment_in.payment_method == "credit_card"
        else None
    )

    gateway_response = SecurePaymentGateway.process_charge(
        amount=payment_in.amount,
        method=payment_in.payment_method,
        card_details=card_details,
    )

    if not gateway_response["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment processing failed: {gateway_response.get('error')}",
        )

    transaction_id = gateway_response["transaction_id"]
    payment_status = "completed"

    # Create payment record
    payment = crud.create_payment(
        db, payment_in=payment_in, transaction_id=transaction_id, status=payment_status
    )

    # Update booking status to confirmed
    booking.status = "confirmed"
    db.commit()
    db.refresh(booking)

    return {
        "amount": float(payment.amount),
        "booking_id": payment.booking_id,
        "created_at": payment.created_at,
        "payment_id": payment.id,
        "status": payment.status,
        "transaction_id": payment.transaction_id,
    }
