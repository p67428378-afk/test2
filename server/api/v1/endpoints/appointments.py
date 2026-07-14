from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from server.database import get_db
from server import schemas, crud, websocket

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
