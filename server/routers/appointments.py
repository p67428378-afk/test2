from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Appointment, Pet, User
from server.schemas import (
    AppointmentCreate,
    AppointmentStatusUpdate,
    AppointmentResponse,
)
from server.auth import get_current_user

router = APIRouter(prefix="/api/v1/appointments", tags=["appointments"])


@router.get("", response_model=List[AppointmentResponse])
def list_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    pet_id: Optional[str] = None,
    vet_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    query = db.query(Appointment)
    if pet_id:
        query = query.filter(Appointment.pet_id == pet_id)
    if vet_id:
        query = query.filter(Appointment.vet_id == vet_id)
    if status_filter:
        query = query.filter(Appointment.status == status_filter)

    appointments = (
        query.order_by(Appointment.appointment_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return appointments


@router.post(
    "", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED
)
def create_appointment(
    appt_in: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify pet exists
    pet = db.query(Pet).filter(Pet.id == appt_in.pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    # Verify vet exists if specified
    if appt_in.vet_id:
        vet = db.query(User).filter(User.id == appt_in.vet_id).first()
        if not vet:
            raise HTTPException(status_code=404, detail="Vet user not found")

    appointment = Appointment(
        pet_id=appt_in.pet_id,
        vet_id=appt_in.vet_id,
        appointment_date=appt_in.appointment_date,
        reason=appt_in.reason,
        status="SCHEDULED",
        notes=appt_in.notes,
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.put("/{id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    id: str,
    status_in: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appointment = db.query(Appointment).filter(Appointment.id == id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment.status = status_in.status
    if status_in.notes is not None:
        appointment.notes = status_in.notes

    db.commit()
    db.refresh(appointment)
    return appointment
