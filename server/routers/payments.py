from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.payment import Payment
from server.models.invoice import Invoice
from server.schemas.payment import PaymentCreate, PaymentResponse

router = APIRouter()


@router.post(
    "/payments", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED
)
def create_payment(payment_in: PaymentCreate, db: Session = Depends(get_db)):
    # Check if invoice exists
    invoice = db.query(Invoice).filter(Invoice.id == payment_in.invoice_id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found."
        )

    # Calculate remaining balance
    existing_payments_sum = sum(p.amount for p in invoice.payments)
    remaining_balance = invoice.total_amount - existing_payments_sum

    amount_decimal = Decimal(str(payment_in.amount))

    if amount_decimal > remaining_balance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment amount exceeds remaining invoice balance.",
        )

    db_payment = Payment(
        invoice_id=payment_in.invoice_id,
        amount=amount_decimal,
        payment_method=payment_in.payment_method,
    )
    db.add(db_payment)

    # Update invoice status
    if remaining_balance - amount_decimal <= 0:
        invoice.status = "paid"
    else:
        invoice.status = "partially_paid"

    db.commit()
    db.refresh(db_payment)
    return db_payment
