from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from server.database import get_db
from server.models import Appointment, Inmate
from server.schemas import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentStatusUpdate,
    AppointmentStatusResponse,
)
from server.api.v1.endpoints.auth import get_current_user_payload

router = APIRouter()


@router.post(
    "/appointments",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_appointment(
    appointment_data: AppointmentCreate,
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user_payload),
):
    visitor_id = payload.get("sub")
    role = payload.get("role")

    if role != "visitor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only registered visitors can request appointments",
        )

    # Verify inmate exists
    inmate = db.query(Inmate).filter(Inmate.id == appointment_data.inmate_id).first()
    if not inmate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inmate not found"
        )

    new_appointment = Appointment(
        visitor_id=UUID(visitor_id),
        inmate_id=appointment_data.inmate_id,
        requested_datetime=appointment_data.requested_datetime,
        status="pending",
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment


@router.get("/appointments", response_model=List[AppointmentResponse])
def list_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user_payload),
):
    user_id = payload.get("sub")
    role = payload.get("role")

    if role in ["staff", "security"]:
        # Admins/Staff see all appointments
        appointments = db.query(Appointment).offset(skip).limit(limit).all()
    elif role == "visitor":
        # Visitors see only their own
        appointments = (
            db.query(Appointment)
            .filter(Appointment.visitor_id == UUID(user_id))
            .offset(skip)
            .limit(limit)
            .all()
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )
    return appointments


@router.put("/appointments/{id}/status", response_model=AppointmentStatusResponse)
def update_appointment_status(
    id: UUID,
    status_data: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
    payload: dict = Depends(get_current_user_payload),
):
    user_id = payload.get("sub")
    role = payload.get("role")

    if role != "staff":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden (Staff only)"
        )

    appointment = db.query(Appointment).filter(Appointment.id == id).first()
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    if appointment.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status transition. Appointment is already processed.",
        )

    appointment.status = status_data.status
    appointment.approved_by_staff_id = UUID(user_id)
    db.commit()
    db.refresh(appointment)
    return appointment
