from sqlalchemy.orm import Session
from server import models, schemas
import uuid


def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(
        user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp


def get_otp(db: Session, otp_session_id: str):
    return db.query(models.OTP).filter(models.OTP.id == otp_session_id).first()


def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True
    db.commit()
    db.refresh(otp)
    return otp


def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(
        user_id=user_id, hashed_password=hashed_password
    )
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history


def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user


# Schedule Slot CRUD Operations
DAY_ORDER = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7,
}


def get_schedule_slots(db: Session, user_id: uuid.UUID):
    slots = (
        db.query(models.ScheduleSlot)
        .filter(models.ScheduleSlot.user_id == user_id)
        .all()
    )
    # Sort chronologically by day of week and start time
    return sorted(slots, key=lambda s: (DAY_ORDER.get(s.day_of_week, 8), s.start_time))


def get_schedule_slot(db: Session, slot_id: uuid.UUID):
    return (
        db.query(models.ScheduleSlot).filter(models.ScheduleSlot.id == slot_id).first()
    )


def create_schedule_slot(
    db: Session, slot: schemas.ScheduleSlotCreate, user_id: uuid.UUID
):
    db_slot = models.ScheduleSlot(
        user_id=user_id,
        event_title=slot.event_title,
        day_of_week=slot.day_of_week,
        start_time=slot.start_time,
        end_time=slot.end_time,
        notes_location=slot.notes_location,
        is_completed=False,
    )
    db.add(db_slot)
    db.commit()
    db.refresh(db_slot)
    return db_slot


def update_schedule_slot(
    db: Session, db_slot: models.ScheduleSlot, slot_update: schemas.ScheduleSlotUpdate
):
    db_slot.event_title = slot_update.event_title
    db_slot.day_of_week = slot_update.day_of_week
    db_slot.start_time = slot_update.start_time
    db_slot.end_time = slot_update.end_time
    db_slot.notes_location = slot_update.notes_location
    db.commit()
    db.refresh(db_slot)
    return db_slot


def toggle_schedule_slot_completion(db: Session, db_slot: models.ScheduleSlot):
    db_slot.is_completed = not db_slot.is_completed
    db.commit()
    db.refresh(db_slot)
    return db_slot


def delete_schedule_slot(db: Session, db_slot: models.ScheduleSlot):
    db.delete(db_slot)
    db.commit()
