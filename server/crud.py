from sqlalchemy.orm import Session
from server import models, schemas
from uuid import UUID
from datetime import datetime, timedelta
import pytz


def get_doctors(db: Session):
    return db.query(models.Doctor).all()


def get_doctor(db: Session, doctor_id: UUID):
    return db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()


def get_patient(db: Session, patient_id: UUID):
    return db.query(models.Patient).filter(models.Patient.id == patient_id).first()


def get_appointments_by_patient(db: Session, patient_id: UUID):
    appointments = (
        db.query(models.Appointment)
        .filter(models.Appointment.patient_id == patient_id)
        .all()
    )
    result = []
    for appt in appointments:
        # Convert estimated_copay to float if present
        copay_val = None
        if appt.estimated_copay is not None:
            try:
                copay_val = float(appt.estimated_copay)
            except ValueError:
                pass
        result.append(
            {
                "id": appt.id,
                "doctorName": appt.doctor.name,
                "start_time": appt.start_time,
                "end_time": appt.end_time,
                "status": appt.status,
                "rescheduled_from_id": appt.rescheduled_from_id,
                "estimated_copay": copay_val,
            }
        )
    return result


def get_doctor_availability(
    db: Session, doctor_id: UUID, start_date: str, end_date: str
):
    # Parse dates
    try:
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").replace(
            hour=23, minute=59, second=59, microsecond=999999
        )
    except ValueError:
        start_dt = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        end_dt = start_dt + timedelta(days=7)

    # Generate standard working slots (e.g., 9:00 AM to 5:00 PM, every 30 mins)
    # For simplicity, let's generate slots for each day in the range
    all_slots = []
    current_day = start_dt
    while current_day <= end_dt:
        # Skip weekends
        if current_day.weekday() < 5:
            # 9:00 to 17:00
            for hour in range(9, 17):
                for minute in (0, 30):
                    slot = datetime(
                        current_day.year,
                        current_day.month,
                        current_day.day,
                        hour,
                        minute,
                        tzinfo=pytz.UTC,
                    )
                    all_slots.append(slot)
        current_day += timedelta(days=1)

    # Get existing confirmed/booked/rescheduled appointments for this doctor in the range
    booked_appts = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.doctor_id == doctor_id,
            models.Appointment.status.in_(["confirmed", "booked", "rescheduled"]),
            models.Appointment.start_time >= start_dt,
            models.Appointment.start_time <= end_dt,
        )
        .all()
    )

    booked_times = {
        appt.start_time.replace(tzinfo=pytz.UTC)
        if appt.start_time.tzinfo is None
        else appt.start_time.astimezone(pytz.UTC)
        for appt in booked_appts
    }

    # Filter out booked slots
    available_slots = []
    for slot in all_slots:
        if slot not in booked_times:
            available_slots.append(slot)

    return available_slots


def create_appointment(db: Session, appointment: schemas.AppointmentCreate):
    # Check if doctor exists
    doctor = get_doctor(db, appointment.doctorId)
    if not doctor:
        return None

    # Check if patient exists
    patient = get_patient(db, appointment.patientId)
    if not patient:
        return None

    # Check for double booking
    # Appointment duration is 30 minutes
    start_time = appointment.startTime
    end_time = start_time + timedelta(minutes=30)

    existing = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.doctor_id == appointment.doctorId,
            models.Appointment.status.in_(["confirmed", "booked", "rescheduled"]),
            models.Appointment.start_time == start_time,
        )
        .first()
    )

    if existing:
        return "double_booked"

    # Update patient's insurance info if provided
    if appointment.insurance_provider:
        patient.insurance_provider = appointment.insurance_provider
    if appointment.policy_id:
        patient.policy_id = appointment.policy_id
    if appointment.insurance_provider or appointment.policy_id:
        db.add(patient)

    # Estimate co-pay if insurance is provided
    estimated_copay = None
    if appointment.insurance_provider and appointment.policy_id:
        provider_lower = appointment.insurance_provider.lower()
        if "blue cross" in provider_lower or "bcbs" in provider_lower:
            estimated_copay = 25.0
        elif "aetna" in provider_lower:
            estimated_copay = 30.0
        elif "cigna" in provider_lower:
            estimated_copay = 35.0
        else:
            estimated_copay = 40.0

    db_appt = models.Appointment(
        doctor_id=appointment.doctorId,
        patient_id=appointment.patientId,
        start_time=start_time,
        end_time=end_time,
        status="confirmed",
        estimated_copay=str(estimated_copay) if estimated_copay is not None else None,
    )
    db.add(db_appt)
    db.commit()
    db.refresh(db_appt)
    return db_appt


def cancel_appointment(db: Session, appointment_id: UUID):
    appt = (
        db.query(models.Appointment)
        .filter(models.Appointment.id == appointment_id)
        .first()
    )
    if not appt:
        return False
    appt.status = "cancelled"
    db.commit()
    db.refresh(appt)
    return appt
