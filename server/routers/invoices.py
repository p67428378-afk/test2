from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.invoice import Invoice
from server.models.patient import Patient
from server.models.appointment import Appointment
from server.schemas.invoice import InvoiceCreate, InvoiceResponse

router = APIRouter()


@router.post(
    "/invoices", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED
)
def create_invoice(invoice_in: InvoiceCreate, db: Session = Depends(get_db)):
    # Check if patient exists
    patient = db.query(Patient).filter(Patient.id == invoice_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found."
        )

    # Check if appointment exists (if provided)
    if invoice_in.appointment_id:
        appointment = (
            db.query(Appointment)
            .filter(Appointment.id == invoice_in.appointment_id)
            .first()
        )
        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found."
            )

    total_amount = invoice_in.amount + invoice_in.tax - invoice_in.discount

    db_invoice = Invoice(
        patient_id=invoice_in.patient_id,
        appointment_id=invoice_in.appointment_id,
        amount=invoice_in.amount,
        tax=invoice_in.tax,
        discount=invoice_in.discount,
        total_amount=total_amount,
        status="unpaid",
        billing_code=invoice_in.billing_code,
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice


@router.get("/invoices", response_model=List[InvoiceResponse])
def list_invoices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return (
        db.query(Invoice)
        .order_by(Invoice.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post("/invoices/{invoice_id}/claim")
def submit_insurance_claim(invoice_id: str, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found."
        )

    patient = invoice.patient
    if (
        not patient
        or not patient.insurance_provider
        or not patient.insurance_policy_number
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient does not have valid insurance details.",
        )

    # Update invoice status to indicate claim is pending
    invoice.status = "claim_pending"
    db.commit()

    return {
        "message": "Insurance claim submitted successfully.",
        "invoice_id": invoice_id,
        "insurance_provider": patient.insurance_provider,
        "policy_number": patient.insurance_policy_number,
        "status": "claim_pending",
    }
