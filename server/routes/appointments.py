from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from server.database import get_db
from server.models import User, VisitorProfile, Inmate, Appointment
from server.schemas import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentPendingResponse,
    AppointmentUpdate,
    VisitorResponse,
    InmateResponse,
)
from server.auth import require_role

router = APIRouter()


@router.post(
    "", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED
)
def create_appointment(
    payload: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["visitor"])),
):
    # Get visitor profile
    profile = (
        db.query(VisitorProfile)
        .filter(VisitorProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Visitor profile not found")

    # Check if visitor is flagged
    if profile.is_flagged:
        raise HTTPException(
            status_code=400,
            detail="Scheduling conflict, visitor is flagged, or maximum visitor limit per inmate exceeded.",
        )

    # Check if inmate exists
    inmate = db.query(Inmate).filter(Inmate.id == payload.inmate_id).first()
    if not inmate:
        raise HTTPException(status_code=404, detail="Inmate not found")

    # Check scheduling conflict (same visitor, same date)
    existing_visitor_appt = (
        db.query(Appointment)
        .filter(
            Appointment.visitor_id == profile.id,
            Appointment.requested_date == payload.requested_date,
            Appointment.status != "denied",
        )
        .first()
    )
    if existing_visitor_appt:
        raise HTTPException(
            status_code=400,
            detail="Scheduling conflict, visitor is flagged, or maximum visitor limit per inmate exceeded.",
        )

    # Check maximum visitor limit per inmate (e.g., max 2 approved/pending appointments per inmate on the same date)
    existing_inmate_appts = (
        db.query(Appointment)
        .filter(
            Appointment.inmate_id == payload.inmate_id,
            Appointment.requested_date == payload.requested_date,
            Appointment.status != "denied",
        )
        .count()
    )
    if existing_inmate_appts >= 2:
        raise HTTPException(
            status_code=400,
            detail="Scheduling conflict, visitor is flagged, or maximum visitor limit per inmate exceeded.",
        )

    # Create appointment
    new_appt = Appointment(
        visitor_id=profile.id,
        inmate_id=payload.inmate_id,
        requested_date=payload.requested_date,
        time_slot=payload.time_slot,
        status="pending",
    )
    db.add(new_appt)
    db.commit()
    db.refresh(new_appt)
    return new_appt


@router.get("/pending", response_model=List[AppointmentPendingResponse])
def get_pending_appointments(
    db: Session = Depends(get_db), current_user: User = Depends(require_role(["staff"]))
):
    appointments = db.query(Appointment).filter(Appointment.status == "pending").all()
    results = []
    for appt in appointments:
        visitor_user = db.query(User).filter(User.id == appt.visitor.user_id).first()
        results.append(
            AppointmentPendingResponse(
                id=appt.id,
                requested_date=appt.requested_date,
                time_slot=appt.time_slot,
                status=appt.status,
                visitor=VisitorResponse(
                    id=appt.visitor.id,
                    email=visitor_user.email if visitor_user else "",
                    full_name=appt.visitor.full_name,
                    phone=appt.visitor.phone,
                    gov_id=appt.visitor.gov_id,
                    is_verified=appt.visitor.is_verified,
                ),
                inmate=InmateResponse(
                    id=appt.inmate.id,
                    full_name=appt.inmate.full_name,
                    inmate_number=appt.inmate.inmate_number,
                    cell_location=appt.inmate.cell_location,
                ),
            )
        )
    return results


@router.put("/{appointment_id}/approve", response_model=AppointmentResponse)
def approve_or_deny_appointment(
    appointment_id: str,
    payload: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["staff"])),
):
    try:
        appt_uuid = uuid.UUID(appointment_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid appointment ID format")

    appt = db.query(Appointment).filter(Appointment.id == appt_uuid).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found.")

    appt.status = payload.status
    if payload.status == "denied":
        appt.denial_reason = payload.denial_reason

    db.commit()
    db.refresh(appt)
    return appt
