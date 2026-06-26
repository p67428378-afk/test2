from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.appointment import Appointment
from server.models.patient import Patient
from server.models.doctor import Doctor
from server.schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentListResponse,
)

router = APIRouter()


@router.post(
    "/appointments",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_appointment(
    appointment_in: AppointmentCreate, db: Session = Depends(get_db)
):
    # Check if patient exists
    patient = db.query(Patient).filter(Patient.id == appointment_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found."
        )

    # Check if doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == appointment_in.doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found."
        )

    # Check for double-booking/conflict
    conflict = (
        db.query(Appointment)
        .filter(
            Appointment.doctor_id == appointment_in.doctor_id,
            Appointment.appointment_date == appointment_in.appointment_date,
            Appointment.status != "cancelled",
        )
        .first()
    )
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Double-booking or appointment conflict.",
        )

    db_appointment = Appointment(
        patient_id=appointment_in.patient_id,
        doctor_id=appointment_in.doctor_id,
        appointment_date=appointment_in.appointment_date,
        notes=appointment_in.notes,
        status="scheduled",
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment


@router.get("/appointments", response_model=List[AppointmentListResponse])
def list_appointments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    appointments = (
        db.query(Appointment)
        .order_by(Appointment.appointment_date.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    result = []
    for appt in appointments:
        result.append(
            AppointmentListResponse(
                id=appt.id,
                patient_id=appt.patient_id,
                patient_name=appt.patient.name,
                doctor_id=appt.doctor_id,
                doctor_name=appt.doctor.name,
                appointment_date=appt.appointment_date,
                status=appt.status,
                notes=appt.notes,
            )
        )
    return result


@router.delete("/appointments/{appointment_id}")
def cancel_appointment(appointment_id: str, db: Session = Depends(get_db)):
    db_appointment = (
        db.query(Appointment).filter(Appointment.id == appointment_id).first()
    )
    if not db_appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found."
        )

    db_appointment.status = "cancelled"
    db.commit()
    return {"message": "Appointment cancelled successfully"}
