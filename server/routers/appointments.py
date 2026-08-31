from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User
from server.schemas import (
    AppointmentCreate,
    AppointmentStatusUpdate,
    AppointmentOut,
)
from server.crud import (
    get_appointments,
    get_appointment,
    create_appointment,
    update_appointment_status,
    get_pet,
)
from server.routers.auth import get_current_user

router = APIRouter(prefix="/api/v1/appointments", tags=["appointments"])


@router.get("", response_model=List[AppointmentOut])
def list_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    pet_id: Optional[str] = Query(None),
    vet_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    return get_appointments(
        db=db,
        skip=skip,
        limit=limit,
        pet_id=pet_id,
        vet_id=vet_id,
        status=status_filter,
    )


@router.post("", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
def book_appointment(
    appt_in: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    # Verify pet exists
    pet = get_pet(db=db, pet_id=appt_in.pet_id)
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet with id '{appt_in.pet_id}' not found",
        )
    vet_id = appt_in.vet_id
    if not vet_id and current_user and current_user.role == "vet":
        vet_id = current_user.id
    return create_appointment(db=db, appt_in=appt_in, vet_id=vet_id)


@router.get("/{id}", response_model=AppointmentOut)
def retrieve_appointment(id: str, db: Session = Depends(get_db)):
    appt = get_appointment(db=db, appointment_id=id)
    if not appt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with id '{id}' not found",
        )
    return appt


@router.put("/{id}/status", response_model=AppointmentOut)
def change_appointment_status(
    id: str,
    status_in: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
):
    updated = update_appointment_status(
        db=db, appointment_id=id, status=status_in.status
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with id '{id}' not found",
        )
    return updated
