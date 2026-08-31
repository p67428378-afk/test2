import uuid
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.models import User, Pet, Appointment, MedicalRecord, Vaccination, Reminder
from server.schemas import (
    UserCreate,
    PetCreate,
    PetUpdate,
    AppointmentCreate,
    MedicalRecordCreate,
    VaccinationCreate,
    ReminderCreate,
)
from server.database import get_password_hash


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


# --- User CRUD ---
def get_user(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_in: UserCreate) -> User:
    db_user = User(
        id=str(uuid.uuid4()),
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role or "owner",
        is_active=True,
        is_verified=True,
        email_verified=True,
        disabled=False,
        is_locked=False,
        created_at=utc_now(),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# --- Pet CRUD ---
def get_pet(db: Session, pet_id: str) -> Optional[Pet]:
    return db.query(Pet).filter(Pet.id == pet_id).first()


def get_pets(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    owner_id: Optional[str] = None,
    species: Optional[str] = None,
    search: Optional[str] = None,
) -> List[Pet]:
    query = db.query(Pet)
    if owner_id:
        query = query.filter(Pet.owner_id == owner_id)
    if species:
        query = query.filter(Pet.species.ilike(f"%{species}%"))
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Pet.name.ilike(search_fmt),
                Pet.breed.ilike(search_fmt),
                Pet.microchip_number.ilike(search_fmt),
            )
        )
    return query.offset(skip).limit(limit).all()


def create_pet(db: Session, pet_in: PetCreate, owner_id: Optional[str] = None) -> Pet:
    db_pet = Pet(
        id=str(uuid.uuid4()),
        owner_id=owner_id or pet_in.owner_id,
        name=pet_in.name,
        species=pet_in.species,
        breed=pet_in.breed,
        age=pet_in.age,
        weight=pet_in.weight,
        gender=pet_in.gender,
        microchip_number=pet_in.microchip_number,
        created_at=utc_now(),
        updated_at=utc_now(),
    )
    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)
    return db_pet


def update_pet(db: Session, pet_id: str, pet_in: PetUpdate) -> Optional[Pet]:
    db_pet = get_pet(db, pet_id)
    if not db_pet:
        return None
    update_data = pet_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_pet, field, value)
    db_pet.updated_at = utc_now()
    db.commit()
    db.refresh(db_pet)
    return db_pet


def delete_pet(db: Session, pet_id: str) -> bool:
    db_pet = get_pet(db, pet_id)
    if not db_pet:
        return False
    db.delete(db_pet)
    db.commit()
    return True


# --- Appointment CRUD ---
def get_appointment(db: Session, appointment_id: str) -> Optional[Appointment]:
    return db.query(Appointment).filter(Appointment.id == appointment_id).first()


def get_appointments(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    pet_id: Optional[str] = None,
    vet_id: Optional[str] = None,
    status: Optional[str] = None,
) -> List[Appointment]:
    query = db.query(Appointment)
    if pet_id:
        query = query.filter(Appointment.pet_id == pet_id)
    if vet_id:
        query = query.filter(Appointment.vet_id == vet_id)
    if status:
        query = query.filter(Appointment.status == status)
    return (
        query.order_by(Appointment.appointment_date.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_appointment(
    db: Session, appt_in: AppointmentCreate, vet_id: Optional[str] = None
) -> Appointment:
    db_appt = Appointment(
        id=str(uuid.uuid4()),
        pet_id=appt_in.pet_id,
        vet_id=vet_id or appt_in.vet_id,
        appointment_date=appt_in.appointment_date,
        reason=appt_in.reason,
        status=appt_in.status or "SCHEDULED",
        notes=appt_in.notes,
        created_at=utc_now(),
        updated_at=utc_now(),
    )
    db.add(db_appt)
    db.commit()
    db.refresh(db_appt)
    return db_appt


def update_appointment_status(
    db: Session, appointment_id: str, status: str
) -> Optional[Appointment]:
    db_appt = get_appointment(db, appointment_id)
    if not db_appt:
        return None
    db_appt.status = status
    db_appt.updated_at = utc_now()
    db.commit()
    db.refresh(db_appt)
    return db_appt


# --- Medical Record CRUD ---
def get_medical_record(db: Session, record_id: str) -> Optional[MedicalRecord]:
    return db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()


def get_medical_records_by_pet(db: Session, pet_id: str) -> List[MedicalRecord]:
    return (
        db.query(MedicalRecord)
        .filter(MedicalRecord.id == MedicalRecord.id, MedicalRecord.pet_id == pet_id)
        .order_by(MedicalRecord.visit_date.desc())
        .all()
    )


def create_medical_record(
    db: Session, rec_in: MedicalRecordCreate, vet_id: Optional[str] = None
) -> MedicalRecord:
    db_rec = MedicalRecord(
        id=str(uuid.uuid4()),
        pet_id=rec_in.pet_id,
        appointment_id=rec_in.appointment_id,
        vet_id=vet_id or rec_in.vet_id,
        visit_date=rec_in.visit_date or utc_now(),
        diagnosis=rec_in.diagnosis,
        treatment=rec_in.treatment,
        prescriptions=rec_in.prescriptions,
        notes=rec_in.notes,
        created_at=utc_now(),
    )
    db.add(db_rec)
    db.commit()
    db.refresh(db_rec)
    return db_rec


# --- Vaccination CRUD ---
def get_vaccination(db: Session, vax_id: str) -> Optional[Vaccination]:
    return db.query(Vaccination).filter(Vaccination.id == vax_id).first()


def get_vaccinations_by_pet(db: Session, pet_id: str) -> List[Vaccination]:
    return (
        db.query(Vaccination)
        .filter(Vaccination.pet_id == pet_id)
        .order_by(Vaccination.administered_date.desc())
        .all()
    )


def create_vaccination(
    db: Session, vax_in: VaccinationCreate, vet_id: Optional[str] = None
) -> Vaccination:
    db_vax = Vaccination(
        id=str(uuid.uuid4()),
        pet_id=vax_in.pet_id,
        vet_id=vet_id or vax_in.vet_id,
        vaccine_name=vax_in.vaccine_name,
        administered_date=vax_in.administered_date or utc_now(),
        next_due_date=vax_in.next_due_date,
        status=vax_in.status or "UP_TO_DATE",
        created_at=utc_now(),
    )
    db.add(db_vax)
    db.commit()
    db.refresh(db_vax)

    # Auto-generate a reminder if next_due_date is provided
    if db_vax.next_due_date:
        db_reminder = Reminder(
            id=str(uuid.uuid4()),
            pet_id=db_vax.pet_id,
            vaccination_id=db_vax.id,
            reminder_type="VACCINATION",
            scheduled_date=db_vax.next_due_date,
            status="PENDING",
            created_at=utc_now(),
        )
        db.add(db_reminder)
        db.commit()

    return db_vax


# --- Reminder CRUD ---
def get_reminders(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    pet_id: Optional[str] = None,
    status: Optional[str] = None,
) -> List[Reminder]:
    query = db.query(Reminder)
    if pet_id:
        query = query.filter(Reminder.pet_id == pet_id)
    if status:
        query = query.filter(Reminder.status == status)
    return query.order_by(Reminder.scheduled_date.asc()).offset(skip).limit(limit).all()


def create_reminder(db: Session, rem_in: ReminderCreate) -> Reminder:
    db_rem = Reminder(
        id=str(uuid.uuid4()),
        pet_id=rem_in.pet_id,
        vaccination_id=rem_in.vaccination_id,
        reminder_type=rem_in.reminder_type or "VACCINATION",
        scheduled_date=rem_in.scheduled_date,
        status=rem_in.status or "PENDING",
        created_at=utc_now(),
    )
    db.add(db_rem)
    db.commit()
    db.refresh(db_rem)
    return db_rem


def process_due_reminders(db: Session) -> int:
    pending_reminders = db.query(Reminder).filter(Reminder.status == "PENDING").all()
    count = 0
    now = utc_now()
    for rem in pending_reminders:
        rem.status = "SENT"
        rem.sent_at = now
        count += 1
    db.commit()
    return count
