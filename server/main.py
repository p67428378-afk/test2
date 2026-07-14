from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import os

from server.database import Base, engine, get_db
from server import models, schemas, crud, websocket
from server.api.v1.endpoints import password_reset

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CareFlow Appointment Booking Service")

# CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include existing routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])

# Include WebSocket router
app.include_router(websocket.router)


# Seed test data on startup
@app.on_event("startup")
def startup_populate():
    db = next(get_db())
    try:
        # Seed doctors if none exist
        if db.query(models.Doctor).count() == 0:
            doc1 = models.Doctor(name="Dr. Alice Smith", specialty="Cardiology")
            doc2 = models.Doctor(name="Dr. Robert Chen", specialty="Pediatrics")
            doc3 = models.Doctor(name="Dr. Emily Taylor", specialty="General Medicine")
            db.add_all([doc1, doc2, doc3])
            db.commit()

        # Seed patients if none exist
        if db.query(models.Patient).count() == 0:
            pat1 = models.Patient(
                name="Sarah Jenkins",
                contact_info={"email": "sarah@example.com", "phone": "555-0199"},
            )
            pat2 = models.Patient(
                name="John Doe",
                contact_info={"email": "test@example.com", "phone": "555-0100"},
            )
            db.add_all([pat1, pat2])
            db.commit()
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()


# API Endpoints


@app.get("/api/v1/doctors", response_model=List[schemas.DoctorResponse])
def get_doctors(db: Session = Depends(get_db)):
    return crud.get_doctors(db)


@app.get(
    "/api/v1/doctors/{doctorId}/availability",
    response_model=schemas.AvailabilityResponse,
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


@app.post(
    "/api/v1/appointments", response_model=schemas.AppointmentResponse, status_code=201
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
    await websocket.manager.broadcast_availability_change(
        str(appointment.doctorId),
        {"event": "availability_changed", "doctorId": str(appointment.doctorId)},
    )

    return result


@app.get(
    "/api/v1/patients/{patientId}/appointments",
    response_model=List[schemas.PatientAppointmentResponse],
)
def get_patient_appointments(patientId: UUID, db: Session = Depends(get_db)):
    patient = crud.get_patient(db, patientId)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return crud.get_appointments_by_patient(db, patientId)


@app.delete("/api/v1/appointments/{appointmentId}", status_code=204)
async def cancel_appointment(appointmentId: UUID, db: Session = Depends(get_db)):
    appt = crud.cancel_appointment(db, appointmentId)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Broadcast real-time update via WebSocket
    await websocket.manager.broadcast_availability_change(
        str(appt.doctor_id),
        {"event": "availability_changed", "doctorId": str(appt.doctor_id)},
    )
    return None


@app.get("/")
def read_root():
    return {"message": "Welcome to the CareFlow Appointment Booking Service"}
