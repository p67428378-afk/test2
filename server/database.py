import os
import uuid
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.exc import IntegrityError

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# SQLite specific connect args
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency for obtaining a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Initialize database tables idempotently."""
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session) -> None:
    """Seed default users and initial data idempotently."""
    from server.models import User, Patient, DoctorSchedule
    from server.security import get_password_hash

    # Seed Admin User
    admin_email = "admin@example.com"
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    if not existing_admin:
        try:
            admin_user = User(
                id=str(uuid.uuid4()),
                email=admin_email,
                hashed_password=get_password_hash("adminpassword"),
                full_name="Hospital Administrator",
                role="Admin",
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
        except IntegrityError:
            db.rollback()

    # Seed Regular/Receptionist User
    test_email = "test@example.com"
    existing_test = db.query(User).filter(User.email == test_email).first()
    if not existing_test:
        try:
            test_user = User(
                id=str(uuid.uuid4()),
                email=test_email,
                hashed_password=get_password_hash("testpassword"),
                full_name="Test Receptionist",
                role="Receptionist",
                is_active=True,
            )
            db.add(test_user)
            db.commit()
        except IntegrityError:
            db.rollback()

    # Seed Doctor User
    doctor_email = "doctor@example.com"
    existing_doctor = db.query(User).filter(User.email == doctor_email).first()
    if not existing_doctor:
        try:
            doctor_user = User(
                id=str(uuid.uuid4()),
                email=doctor_email,
                hashed_password=get_password_hash("doctorpassword"),
                full_name="Dr. John Smith",
                role="Doctor",
                is_active=True,
            )
            db.add(doctor_user)
            db.commit()
            existing_doctor = doctor_user
        except IntegrityError:
            db.rollback()
            existing_doctor = db.query(User).filter(User.email == doctor_email).first()

    # Seed Doctor Schedule for Dr. John Smith
    if existing_doctor:
        existing_schedule = (
            db.query(DoctorSchedule)
            .filter(DoctorSchedule.doctor_id == existing_doctor.id)
            .first()
        )
        if not existing_schedule:
            try:
                for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]:
                    schedule = DoctorSchedule(
                        id=str(uuid.uuid4()),
                        doctor_id=existing_doctor.id,
                        day_of_week=day,
                        start_time="09:00:00",
                        end_time="17:00:00",
                        slot_duration_minutes=30,
                    )
                    db.add(schedule)
                db.commit()
            except IntegrityError:
                db.rollback()

    # Seed Sample Patient
    sample_ssn = "SSN-999-00-1234"
    existing_patient = (
        db.query(Patient).filter(Patient.ssn_gov_id == sample_ssn).first()
    )
    if not existing_patient:
        try:
            from datetime import date

            sample_patient = Patient(
                id=str(uuid.uuid4()),
                ssn_gov_id=sample_ssn,
                first_name="Jane",
                last_name="Doe",
                dob=date(1990, 5, 15),
                gender="Female",
                phone="555-0199",
                emergency_contact="555-0198",
                medical_history="No known allergies.",
            )
            db.add(sample_patient)
            db.commit()
        except IntegrityError:
            db.rollback()
