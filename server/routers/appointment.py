import uuid
from datetime import date
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.appointment import (
    AppointmentCreate,
    AppointmentStatusUpdate,
    AppointmentOut,
)
from server.services import appointment_service

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.post("", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment_in: AppointmentCreate,
    db: Session = Depends(get_db),
):
    return appointment_service.create_appointment(db, appointment_in)


@router.get("", response_model=List[AppointmentOut])
def list_appointments(
    status_filter: Optional[str] = Query(None, alias="status"),
    visit_date: Optional[date] = Query(None),
    inmate_id: Optional[uuid.UUID] = Query(None),
    visitor_id: Optional[uuid.UUID] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return appointment_service.list_appointments(
        db,
        status_filter=status_filter,
        visit_date=visit_date,
        inmate_id=inmate_id,
        visitor_id=visitor_id,
        skip=skip,
        limit=limit,
    )


@router.get("/{id}", response_model=AppointmentOut)
def get_appointment(id: uuid.UUID, db: Session = Depends(get_db)):
    return appointment_service.get_appointment_by_id(db, id)


@router.patch("/{id}/status", response_model=AppointmentOut)
def update_status(
    id: uuid.UUID,
    status_update: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
):
    return appointment_service.update_appointment_status(db, id, status_update)
