from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Appointment, DoctorSlot, Patient, User
from server.schemas import (
    AppointmentCreate,
    AppointmentStatusUpdate,
    AppointmentResponse,
)
from server.app.auth.utils import get_current_user, require_roles

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.post(
    "", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED
)
def book_appointment(
    apt_in: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify patient exists
    patient = db.query(Patient).filter(Patient.id == apt_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    # Verify doctor exists
    doctor = db.query(User).filter(User.id == apt_in.doctor_id).first()
    if not doctor or doctor.role != "Doctor":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )

    # Verify and atomically lock/reserve slot
    slot_query = db.query(DoctorSlot).filter(DoctorSlot.id == apt_in.slot_id)
    # If using postgresql, with_for_update can be applied
    if db.bind and db.bind.dialect.name == "postgresql":
        slot = slot_query.with_for_update().first()
    else:
        slot = slot_query.first()

    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor slot not found",
        )

    if slot.doctor_id != apt_in.doctor_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slot does not belong to the specified doctor",
        )

    if slot.is_booked:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This slot is already booked",
        )

    # Mark slot as booked
    slot.is_booked = True

    appointment = Appointment(
        patient_id=apt_in.patient_id,
        doctor_id=apt_in.doctor_id,
        slot_id=apt_in.slot_id,
        status="Scheduled",
        reason_for_visit=apt_in.reason_for_visit,
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.get("", response_model=List[AppointmentResponse])
def list_appointments(
    patient_id: Optional[str] = Query(None, description="Filter by patient UUID"),
    doctor_id: Optional[str] = Query(None, description="Filter by doctor UUID"),
    status_filter: Optional[str] = Query(
        None, alias="status", description="Filter by status"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Appointment)
    if patient_id:
        query = query.filter(Appointment.patient_id == patient_id)
    if doctor_id:
        query = query.filter(Appointment.doctor_id == doctor_id)
    if status_filter:
        query = query.filter(Appointment.status == status_filter)

    # If Patient role, restrict to own appointments
    if current_user.role == "Patient":
        patient_profile = (
            db.query(Patient).filter(Patient.user_id == current_user.id).first()
        )
        if patient_profile:
            query = query.filter(Appointment.patient_id == patient_profile.id)

    appointments = (
        query.order_by(Appointment.created_at.desc()).offset(skip).limit(limit).all()
    )
    return appointments


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )
    return appointment


@router.patch("/{appointment_id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    appointment_id: str,
    status_in: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Admin", "Doctor", "Staff")),
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    appointment.status = status_in.status
    if status_in.status == "Cancelled" and appointment.slot:
        appointment.slot.is_booked = False

    db.commit()
    db.refresh(appointment)
    return appointment
