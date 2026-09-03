from datetime import datetime, timezone
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Payment, Session as DbSession, User
from server.schemas import PaymentCreate, PaymentOut, PaymentProcessResponse
from server.auth import get_current_user

router = APIRouter(prefix="/payments", tags=["Payment Tracking & Ledger"])


@router.get("", response_model=List[PaymentOut])
def list_payments(
    session_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Payment)
    if session_id:
        query = query.filter(Payment.session_id == session_id)

    if current_user.role == "customer":
        query = query.join(DbSession).filter(DbSession.customer_id == current_user.id)
    elif current_user.role == "photographer":
        if current_user.photographer_profile:
            query = query.join(DbSession).filter(
                DbSession.photographer_id == current_user.photographer_profile.id
            )
        else:
            return []

    return query.order_by(Payment.created_at.desc()).all()


@router.get("/{payment_id}", response_model=PaymentOut)
def get_payment(
    payment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    p = db.query(Payment).filter(Payment.id == payment_id).first()
    if not p:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Payment record not found."
        )

    sess = p.session
    if current_user.role == "customer" and sess.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden."
        )
    if current_user.role == "photographer":
        if (
            not current_user.photographer_profile
            or sess.photographer_id != current_user.photographer_profile.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden."
            )

    return p


@router.post(
    "", response_model=PaymentProcessResponse, status_code=status.HTTP_201_CREATED
)
def process_payment(
    payment_in: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Fetch Session
    sess = db.query(DbSession).filter(DbSession.id == payment_in.session_id).first()
    if not sess:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated session not found.",
        )

    if current_user.role == "customer" and sess.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden."
        )

    if payment_in.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment amount must be greater than zero.",
        )

    # 2. Existing payments sum
    prior_paid = sum(
        p.amount for p in sess.payments if p.payment_status in ["paid", "partial"]
    )
    new_total_paid = prior_paid + payment_in.amount

    # 3. Determine payment status
    if new_total_paid >= sess.total_price:
        current_payment_status = "paid"
        session_payment_summary = "paid"
    elif new_total_paid > 0:
        current_payment_status = "partial"
        session_payment_summary = "partial"
    else:
        current_payment_status = "pending"
        session_payment_summary = "pending"

    # 4. Create Payment Record
    payment = Payment(
        id=str(uuid.uuid4()),
        session_id=sess.id,
        amount=round(payment_in.amount, 2),
        payment_status=current_payment_status,
        payment_method=payment_in.payment_method,
        transaction_reference=payment_in.transaction_reference
        or f"TXN-{uuid.uuid4().hex[:8].upper()}",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(payment)

    # 5. Update session status if it was pending_payment and at least deposit paid
    if sess.status == "pending_payment" and new_total_paid >= sess.deposit_amount:
        sess.status = "confirmed"
        sess.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(payment)
    db.refresh(sess)

    remaining = max(0.0, sess.total_price - new_total_paid)

    return PaymentProcessResponse(
        payment=payment,
        payment_status=session_payment_summary,
        total_paid=round(new_total_paid, 2),
        remaining_balance=round(remaining, 2),
        session_status=sess.status,
    )
