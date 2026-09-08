from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Invoice, Reservation
from server.schemas import InvoiceOut, PaymentRequest

router = APIRouter(prefix="/api/v1/invoices", tags=["invoices"])


@router.get("", response_model=List[InvoiceOut])
def get_all_invoices(
    payment_status: Optional[str] = Query(
        None, description="Filter by payment status (UNPAID, PAID, PARTIAL)"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Invoice)
    if payment_status:
        query = query.filter(Invoice.payment_status == payment_status)
    invoices = query.order_by(Invoice.created_at.desc()).offset(skip).limit(limit).all()
    return invoices


@router.get("/{reservation_id}", response_model=InvoiceOut)
def get_invoice_by_reservation(reservation_id: str, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.reservation_id == reservation_id).first()
    if not invoice:
        # Check if reservation exists
        reservation = (
            db.query(Reservation).filter(Reservation.id == reservation_id).first()
        )
        if not reservation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Reservation with id {reservation_id} not found",
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invoice for reservation {reservation_id} not found",
        )
    return invoice


@router.post("/{reservation_id}/pay", response_model=InvoiceOut)
def pay_invoice(
    reservation_id: str,
    payment_in: PaymentRequest,
    db: Session = Depends(get_db),
):
    invoice = db.query(Invoice).filter(Invoice.reservation_id == reservation_id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invoice for reservation {reservation_id} not found",
        )

    # Apply promo discount if provided
    if payment_in.promo_code:
        promo = payment_in.promo_code.strip().upper()
        if promo in ["WELCOME10", "PROMO10"]:
            invoice.discount_amount = max(
                invoice.discount_amount, round(invoice.room_charges * 0.10, 2)
            )
        elif promo in ["SAVE20", "HOTEL20"]:
            invoice.discount_amount = max(invoice.discount_amount, 20.0)
        elif promo in ["VIP50"]:
            invoice.discount_amount = max(invoice.discount_amount, 50.0)

    if payment_in.discount_amount and payment_in.discount_amount > 0:
        invoice.discount_amount = max(
            invoice.discount_amount, payment_in.discount_amount
        )

    # Recalculate total
    invoice.total_amount = max(
        0.0,
        round(
            invoice.room_charges
            + invoice.tax_amount
            + invoice.service_fees
            - invoice.discount_amount,
            2,
        ),
    )

    pay_amount = (
        payment_in.amount if payment_in.amount is not None else invoice.total_amount
    )

    if pay_amount >= invoice.total_amount:
        invoice.payment_status = "PAID"
    elif pay_amount > 0:
        invoice.payment_status = "PARTIAL"
    else:
        invoice.payment_status = "UNPAID"

    db.commit()
    db.refresh(invoice)
    return invoice
