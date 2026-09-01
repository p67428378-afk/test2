from typing import Generator
from datetime import datetime, date, timedelta
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError

from server.config import settings
from server.models import Base, User, Patient, DoctorSlot

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session) -> None:
    # 1. Seed default accounts idempotently
    users_to_seed = [
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "role": "Admin",
        },
        {
            "email": "test@example.com",
            "password": "testpassword",
            "role": "Staff",
        },
        {
            "email": "doctor@example.com",
            "password": "doctorpassword",
            "role": "Doctor",
        },
        {
            "email": "patient@example.com",
            "password": "patientpassword",
            "role": "Patient",
        },
    ]

    doctor_user = None
    for u in users_to_seed:
        try:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                new_user = User(
                    email=u["email"],
                    password_hash=get_password_hash(u["password"]),
                    role=u["role"],
                    is_active=True,
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                if u["role"] == "Doctor":
                    doctor_user = new_user
            else:
                if u["role"] == "Doctor":
                    doctor_user = existing
        except IntegrityError:
            db.rollback()

    # 2. Seed a sample patient if none exists
    try:
        existing_patient = (
            db.query(Patient).filter(Patient.phone == "+1-555-0199").first()
        )
        if not existing_patient:
            patient_user = (
                db.query(User).filter(User.email == "patient@example.com").first()
            )
            sample_patient = Patient(
                user_id=patient_user.id if patient_user else None,
                full_name="John Doe",
                date_of_birth=date(1985, 5, 20),
                gender="Male",
                phone="+1-555-0199",
                emergency_contact="Jane Doe (+1-555-0198)",
                medical_history="No known allergies. Mild hypertension.",
                insurance_provider="BlueCross Shield",
                insurance_policy_number="BCS-892144",
            )
            db.add(sample_patient)
            db.commit()
    except IntegrityError:
        db.rollback()

    # 3. Seed sample doctor slots if none exist
    if doctor_user:
        try:
            existing_slots = (
                db.query(DoctorSlot)
                .filter(DoctorSlot.doctor_id == doctor_user.id)
                .first()
            )
            if not existing_slots:
                now = datetime.utcnow().replace(
                    minute=0, second=0, microsecond=0
                ) + timedelta(days=1)
                slot1 = DoctorSlot(
                    doctor_id=doctor_user.id,
                    department="Cardiology",
                    start_time=now + timedelta(hours=9),
                    end_time=now + timedelta(hours=9, minutes=30),
                    is_booked=False,
                )
                slot2 = DoctorSlot(
                    doctor_id=doctor_user.id,
                    department="Cardiology",
                    start_time=now + timedelta(hours=10),
                    end_time=now + timedelta(hours=10, minutes=30),
                    is_booked=False,
                )
                db.add_all([slot1, slot2])
                db.commit()
        except IntegrityError:
            db.rollback()
