import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Invoice, Patient, Appointment, User
from server.schemas import InvoiceCreate, InvoiceResponse
from server.security import get_current_user, require_roles

router = APIRouter(prefix="/api/v1/invoices", tags=["Billing & Invoicing"])


def _format_invoice_response(invoice: Invoice) -> dict:
    """Helper to convert Invoice model instance to a dict with parsed itemized_details."""
    details = invoice.itemized_details
    if isinstance(details, str) and details:
        try:
            details = json.loads(details)
        except Exception:
            details = [{"description": details, "amount": invoice.amount}]
    elif not details:
        details = []

    return {
        "id": invoice.id,
        "appointment_id": invoice.appointment_id,
        "patient_id": invoice.patient_id,
        "amount": invoice.amount,
        "status": invoice.status,
        "itemized_details": details,
        "created_at": invoice.created_at,
        "updated_at": invoice.updated_at,
    }


@router.get("", response_model=List[InvoiceResponse])
def list_invoices(
    patient_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List itemized billing invoices."""
    query = db.query(Invoice)
    if patient_id:
        query = query.filter(Invoice.patient_id == patient_id)
    if status_filter:
        query = query.filter(Invoice.status == status_filter.upper())

    invoices = query.offset(skip).limit(limit).all()
    return [_format_invoice_response(inv) for inv in invoices]


@router.post("", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def create_invoice(
    invoice_in: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["Receptionist", "Admin"])),
):
    """Manually generate an itemized invoice for an appointment."""
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == invoice_in.appointment_id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found."
        )

    patient = db.query(Patient).filter(Patient.id == invoice_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found."
        )

    itemized_str = (
        json.dumps(invoice_in.itemized_details)
        if invoice_in.itemized_details is not None
        else None
    )

    invoice = Invoice(
        appointment_id=invoice_in.appointment_id,
        patient_id=invoice_in.patient_id,
        amount=invoice_in.amount,
        status="PENDING",
        itemized_details=itemized_str,
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return _format_invoice_response(invoice)


@router.get("/{id}", response_model=InvoiceResponse)
def get_invoice(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get specific invoice details."""
    invoice = db.query(Invoice).filter(Invoice.id == id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found."
        )
    return _format_invoice_response(invoice)


@router.post("/{id}/pay", response_model=InvoiceResponse)
def pay_invoice(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Record invoice payment (PENDING -> PAID)."""
    invoice = db.query(Invoice).filter(Invoice.id == id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found."
        )

    if invoice.status == "PAID":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invoice is already paid."
        )

    invoice.status = "PAID"
    db.commit()
    db.refresh(invoice)
    return _format_invoice_response(invoice)
