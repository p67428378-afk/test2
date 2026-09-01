from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Invoice, Appointment, Patient, User
from server.schemas import InvoiceCreate, InvoicePaymentUpdate, InvoiceResponse
from server.app.auth.utils import get_current_user, require_roles

router = APIRouter(prefix="/invoices", tags=["Billing & Invoices"])


@router.post("", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def create_invoice(
    invoice_in: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin", "Staff")),
):
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == invoice_in.appointment_id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    patient = db.query(Patient).filter(Patient.id == invoice_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    invoice = Invoice(
        appointment_id=invoice_in.appointment_id,
        patient_id=invoice_in.patient_id,
        total_amount=invoice_in.total_amount,
        line_items=invoice_in.line_items,
        payment_status=invoice_in.payment_status,
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice


@router.get("", response_model=List[InvoiceResponse])
def list_invoices(
    patient_id: Optional[str] = Query(None, description="Filter by patient UUID"),
    payment_status: Optional[str] = Query(None, description="Filter by payment status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Invoice)
    if patient_id:
        query = query.filter(Invoice.patient_id == patient_id)
    if payment_status:
        query = query.filter(Invoice.payment_status == payment_status)

    if current_user.role == "Patient":
        patient_profile = (
            db.query(Patient).filter(Patient.user_id == current_user.id).first()
        )
        if patient_profile:
            query = query.filter(Invoice.patient_id == patient_profile.id)

    invoices = query.order_by(Invoice.created_at.desc()).offset(skip).limit(limit).all()
    return invoices


@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found",
        )

    if current_user.role == "Patient":
        patient_profile = (
            db.query(Patient).filter(Patient.user_id == current_user.id).first()
        )
        if not patient_profile or invoice.patient_id != patient_profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this invoice",
            )
    return invoice


@router.patch("/{invoice_id}/payment", response_model=InvoiceResponse)
def update_payment_status(
    invoice_id: str,
    payment_in: InvoicePaymentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin", "Staff")),
):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found",
        )

    invoice.payment_status = payment_in.payment_status
    db.commit()
    db.refresh(invoice)
    return invoice
