from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import datetime, timedelta
import pytz

from server.database import get_db
from server import schemas, crud, websocket, models

router = APIRouter()


@router.get("/doctors", response_model=List[schemas.DoctorResponse])
def get_doctors(db: Session = Depends(get_db)):
    return crud.get_doctors(db)


@router.get(
    "/doctors/{doctorId}/availability", response_model=schemas.AvailabilityResponse
)
def get_doctor_availability(
    doctorId: UUID,
    start_date: str = Query(..., description="Start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    doctor = crud.get_doctor(db, doctorId)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    slots = crud.get_doctor_availability(db, doctorId, start_date, end_date)
    return {"doctorId": doctorId, "slots": slots}


@router.post(
    "/appointments", response_model=schemas.AppointmentResponse, status_code=201
)
async def create_appointment(
    appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)
):
    result = crud.create_appointment(db, appointment)
    if result is None:
        raise HTTPException(status_code=404, detail="Doctor or Patient not found")
    if result == "double_booked":
        raise HTTPException(
            status_code=400, detail="The selected time slot is already booked"
        )

    # Broadcast real-time update via WebSocket
    try:
        await websocket.manager.broadcast_availability_change(
            str(appointment.doctorId),
            {"event": "availability_changed", "doctorId": str(appointment.doctorId)},
        )
    except Exception:
        pass

    return result


@router.get(
    "/patients/{patientId}/appointments",
    response_model=List[schemas.PatientAppointmentResponse],
)
def get_patient_appointments(patientId: UUID, db: Session = Depends(get_db)):
    patient = crud.get_patient(db, patientId)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return crud.get_appointments_by_patient(db, patientId)


@router.delete("/appointments/{appointmentId}", status_code=204)
async def cancel_appointment(appointmentId: UUID, db: Session = Depends(get_db)):
    appt = crud.cancel_appointment(db, appointmentId)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Broadcast real-time update via WebSocket
    try:
        await websocket.manager.broadcast_availability_change(
            str(appt.doctor_id),
            {"event": "availability_changed", "doctorId": str(appt.doctor_id)},
        )
    except Exception:
        pass
    return None


@router.patch(
    "/appointments/{appointmentId}/reschedule",
    response_model=schemas.AppointmentResponse,
)
async def reschedule_appointment(
    appointmentId: UUID,
    payload: schemas.AppointmentRescheduleRequest,
    db: Session = Depends(get_db),
):
    # 1. Fetch the existing appointment
    appt = (
        db.query(models.Appointment)
        .filter(models.Appointment.id == appointmentId)
        .first()
    )
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # 2. Check if already cancelled
    if appt.status == "cancelled":
        raise HTTPException(
            status_code=409,
            detail="Cannot reschedule a cancelled appointment",
        )

    # 3. Check 24-hour rule
    now_utc = datetime.now(pytz.UTC)
    appt_start = appt.start_time
    if appt_start.tzinfo is None:
        appt_start = pytz.UTC.localize(appt_start)
    else:
        appt_start = appt_start.astimezone(pytz.UTC)

    if appt_start - now_utc < timedelta(hours=24):
        raise HTTPException(
            status_code=409,
            detail="Cannot reschedule within 24 hours of the appointment start time",
        )

    # 4. Check double booking for the new slot
    new_start = payload.new_start_time
    new_end = payload.new_end_time

    # Check if any other active appointment is booked for this doctor at the new slot
    conflict = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.doctor_id == appt.doctor_id,
            models.Appointment.status.in_(["confirmed", "booked", "rescheduled"]),
            models.Appointment.start_time == new_start,
            models.Appointment.id != appt.id,
        )
        .first()
    )
    if conflict:
        raise HTTPException(
            status_code=409,
            detail="The selected slot is already booked",
        )

    # 5. Re-estimate co-pay via clearinghouse simulation
    # If patient has insurance, we re-estimate. If clearinghouse is unavailable, we still complete.
    patient = (
        db.query(models.Patient).filter(models.Patient.id == appt.patient_id).first()
    )
    estimated_copay = None
    if patient and patient.insurance_provider and patient.policy_id:
        provider_lower = patient.insurance_provider.lower()
        if "blue cross" in provider_lower or "bcbs" in provider_lower:
            estimated_copay = 25.0
        elif "aetna" in provider_lower:
            estimated_copay = 30.0
        elif "cigna" in provider_lower:
            estimated_copay = 35.0
        else:
            estimated_copay = 40.0

    # 6. Perform atomic update
    old_doctor_id = appt.doctor_id

    # Create a new appointment record for the rescheduled slot
    new_appt = models.Appointment(
        doctor_id=appt.doctor_id,
        patient_id=appt.patient_id,
        start_time=new_start,
        end_time=new_end,
        status="rescheduled",
        rescheduled_from_id=appt.id,
        estimated_copay=str(estimated_copay) if estimated_copay is not None else None,
    )
    db.add(new_appt)

    # Mark the old appointment as cancelled
    appt.status = "cancelled"
    db.add(appt)

    try:
        db.commit()
        db.refresh(new_appt)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database transaction failed: {str(e)}",
        )

    # 7. Send notification (simulation)
    # In a real app, we would call notification_service.send(...)
    # We just log or simulate success.

    # 8. Broadcast real-time update via WebSocket
    try:
        await websocket.manager.broadcast_availability_change(
            str(old_doctor_id),
            {"event": "availability_changed", "doctorId": str(old_doctor_id)},
        )
    except Exception:
        pass

    return new_appt
