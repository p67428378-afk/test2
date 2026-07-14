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
        result.append(
            {
                "id": appt.id,
                "doctorName": appt.doctor.name,
                "start_time": appt.start_time,
                "end_time": appt.end_time,
                "status": appt.status,
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

    # Get existing confirmed appointments for this doctor in the range
    booked_appts = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.doctor_id == doctor_id,
            models.Appointment.status == "confirmed",
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
            models.Appointment.status == "confirmed",
            models.Appointment.start_time == start_time,
        )
        .first()
    )

    if existing:
        return "double_booked"

    db_appt = models.Appointment(
        doctor_id=appointment.doctorId,
        patient_id=appointment.patientId,
        start_time=start_time,
        end_time=end_time,
        status="confirmed",
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
