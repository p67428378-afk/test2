from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas
from server.services.appointment_service import validate_and_create_appointment
from server.services.qr_service import (
    generate_pass_token,
    generate_pdf_pass_bytes,
    generate_qr_code_data_url,
)

router = APIRouter(prefix="/api/v1/appointments", tags=["Appointments"])


def _issue_digital_pass(
    db: Session, appointment: models.Appointment
) -> models.DigitalPass:
    """Helper to generate and persist a digital pass for an approved appointment."""
    existing_pass = (
        db.query(models.DigitalPass)
        .filter(models.DigitalPass.appointment_id == appointment.id)
        .first()
    )
    if existing_pass:
        return existing_pass

    # Expiration: End of the visit day + 4 hours buffer
    visit_datetime = datetime.combine(appointment.visit_date, appointment.start_time)
    expires_at = visit_datetime + timedelta(
        minutes=appointment.slot_duration_minutes + 240
    )

    pass_token = generate_pass_token(
        appointment_id=appointment.id,
        visitor_id=appointment.visitor_id,
        inmate_id=appointment.inmate_id,
        visit_date=str(appointment.visit_date),
        expires_at=expires_at,
    )
    qr_data_url = generate_qr_code_data_url(pass_token)
    pdf_url = f"/api/v1/appointments/{appointment.id}/digital-pass/pdf"

    digital_pass = models.DigitalPass(
        appointment_id=appointment.id,
        pass_token=pass_token,
        qr_code_data_url=qr_data_url,
        pdf_download_url=pdf_url,
        expires_at=expires_at,
        is_used=False,
    )
    db.add(digital_pass)
    db.commit()
    db.refresh(digital_pass)
    return digital_pass


@router.post(
    "", response_model=schemas.AppointmentResponse, status_code=status.HTTP_201_CREATED
)
def create_appointment(
    appt_in: schemas.AppointmentCreate, db: Session = Depends(get_db)
):
    visitor = (
        db.query(models.Visitor).filter(models.Visitor.id == appt_in.visitor_id).first()
    )
    if not visitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Visitor not found"
        )

    inmate = (
        db.query(models.Inmate).filter(models.Inmate.id == appt_in.inmate_id).first()
    )
    if not inmate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Inmate not found"
        )

    appointment, err_msg = validate_and_create_appointment(
        db=db,
        visitor=visitor,
        inmate=inmate,
        visit_date=appt_in.visit_date,
        start_time=appt_in.start_time,
        slot_duration_minutes=appt_in.slot_duration_minutes,
        relationship=appt_in.relationship,
    )

    if err_msg or not appointment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err_msg or "Failed to create appointment",
        )

    return appointment


@router.get("", response_model=List[schemas.AppointmentResponse])
def list_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    visitor_id: Optional[str] = None,
    inmate_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Appointment)
    if visitor_id:
        query = query.filter(models.Appointment.visitor_id == visitor_id)
    if inmate_id:
        query = query.filter(models.Appointment.inmate_id == inmate_id)
    if status_filter:
        query = query.filter(models.Appointment.status == status_filter.upper())
    return (
        query.order_by(
            models.Appointment.visit_date.desc(), models.Appointment.start_time.asc()
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{appointment_id}", response_model=schemas.AppointmentResponse)
def get_appointment(appointment_id: str, db: Session = Depends(get_db)):
    appointment = (
        db.query(models.Appointment)
        .filter(models.Appointment.id == appointment_id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )
    return appointment


@router.patch("/{appointment_id}/status", response_model=schemas.AppointmentResponse)
def update_appointment_status(
    appointment_id: str,
    status_update: schemas.AppointmentStatusUpdate,
    db: Session = Depends(get_db),
):
    appointment = (
        db.query(models.Appointment)
        .filter(models.Appointment.id == appointment_id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    new_status = status_update.status.upper()
    appointment.status = new_status
    if status_update.rejection_reason:
        appointment.rejection_reason = status_update.rejection_reason

    db.commit()
    db.refresh(appointment)

    # Automatic Digital Pass Generation upon approval
    if new_status == "APPROVED":
        _issue_digital_pass(db, appointment)
        db.refresh(appointment)

    return appointment


@router.post(
    "/{appointment_id}/digital-pass", response_model=schemas.DigitalPassResponse
)
def generate_digital_pass_for_appointment(
    appointment_id: str, db: Session = Depends(get_db)
):
    appointment = (
        db.query(models.Appointment)
        .filter(models.Appointment.id == appointment_id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    if appointment.status != "APPROVED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Digital pass can only be generated for APPROVED appointments",
        )

    digital_pass = _issue_digital_pass(db, appointment)
    return digital_pass


@router.get("/{appointment_id}/digital-pass/pdf")
def download_digital_pass_pdf(appointment_id: str, db: Session = Depends(get_db)):
    appointment = (
        db.query(models.Appointment)
        .filter(models.Appointment.id == appointment_id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    if not appointment.digital_pass:
        if appointment.status == "APPROVED":
            _issue_digital_pass(db, appointment)
            db.refresh(appointment)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No digital pass issued for this appointment",
            )

    if not appointment.digital_pass:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate digital pass",
        )

    pdf_bytes = generate_pdf_pass_bytes(
        appointment, appointment.digital_pass.pass_token
    )
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=pass_{appointment_id}.pdf"
        },
    )
