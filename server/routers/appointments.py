import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Appointment, Patient, User, Invoice
from server.schemas import (
    AppointmentCreate,
    AppointmentUpdateStatus,
    AppointmentResponse,
)
from server.security import get_current_user

router = APIRouter(prefix="/api/v1/appointments", tags=["Appointments"])


@router.post(
    "", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED
)
def book_appointment(
    appointment_in: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Book a 30-minute appointment slot with concurrency / double-booking check."""
    # Verify Patient
    patient = db.query(Patient).filter(Patient.id == appointment_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found."
        )

    # Verify Doctor
    doctor = db.query(User).filter(User.id == appointment_in.doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found."
        )

    # Double-booking check: Check if doctor has existing active appointment at exact time
    existing_appointment = (
        db.query(Appointment)
        .filter(
            Appointment.doctor_id == appointment_in.doctor_id,
            Appointment.appointment_time == appointment_in.appointment_time,
            Appointment.status != "CANCELLED",
        )
        .first()
    )
    if existing_appointment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Doctor is already booked for the selected 30-minute time slot.",
        )

    appointment = Appointment(
        patient_id=appointment_in.patient_id,
        doctor_id=appointment_in.doctor_id,
        appointment_time=appointment_in.appointment_time,
        status="SCHEDULED",
        notes=appointment_in.notes,
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.get("", response_model=List[AppointmentResponse])
def list_appointments(
    doctor_id: Optional[str] = Query(None),
    patient_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List appointments with optional doctor/patient filtering."""
    query = db.query(Appointment)
    if doctor_id:
        query = query.filter(Appointment.doctor_id == doctor_id)
    if patient_id:
        query = query.filter(Appointment.patient_id == patient_id)
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=AppointmentResponse)
def get_appointment(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get appointment details by ID."""
    appointment = db.query(Appointment).filter(Appointment.id == id).first()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found."
        )
    return appointment


@router.patch("/{id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    id: str,
    status_in: AppointmentUpdateStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update appointment status (SCHEDULED, CONFIRMED, COMPLETED, CANCELLED).
    Enforces business rule: Invoices are automatically generated upon appointment completion.
    """
    appointment = db.query(Appointment).filter(Appointment.id == id).first()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found."
        )

    old_status = appointment.status
    new_status = status_in.status.upper()
    appointment.status = new_status

    # Auto-generate invoice when appointment moves to COMPLETED
    if new_status == "COMPLETED" and old_status != "COMPLETED":
        existing_invoice = (
            db.query(Invoice).filter(Invoice.appointment_id == id).first()
        )
        if not existing_invoice:
            itemized_data = [
                {"description": "General Medical Consultation", "amount": 150.0}
            ]
            invoice = Invoice(
                appointment_id=appointment.id,
                patient_id=appointment.patient_id,
                amount=150.0,
                status="PENDING",
                itemized_details=json.dumps(itemized_data),
            )
            db.add(invoice)

    db.commit()
    db.refresh(appointment)
    return appointment
