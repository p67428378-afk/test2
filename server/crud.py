# server/crud.py
from sqlalchemy.orm import Session
from server import models, schemas
from typing import Optional
from datetime import datetime


def get_events(
    db: Session,
    search: Optional[str] = None,
    category: Optional[str] = None,
    location: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
):
    query = db.query(models.Event)
    if search:
        query = query.filter(
            (models.Event.title.ilike(f"%{search}%"))
            | (models.Event.description.ilike(f"%{search}%"))
        )
    if category:
        query = query.filter(models.Event.category.ilike(category))
    if location:
        query = query.filter(models.Event.location.ilike(f"%{location}%"))
    if start_date:
        query = query.filter(models.Event.date_time >= start_date)
    if end_date:
        query = query.filter(models.Event.date_time <= end_date)
    return query.all()


def get_event(db: Session, event_id: str):
    return db.query(models.Event).filter(models.Event.id == event_id).first()


def create_event(db: Session, event: schemas.EventCreate):
    db_event = models.Event(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def update_event(db: Session, event_id: str, event_update: schemas.EventUpdate):
    db_event = get_event(db, event_id)
    if not db_event:
        return None
    for key, value in event_update.model_dump(exclude_unset=True).items():
        setattr(db_event, key, value)
    db.commit()
    db.refresh(db_event)
    return db_event


def delete_event(db: Session, event_id: str):
    db_event = get_event(db, event_id)
    if not db_event:
        return False
    db.delete(db_event)
    db.commit()
    return True


def get_registration_by_email(db: Session, event_id: str, email: str):
    return (
        db.query(models.Registration)
        .filter(
            models.Registration.event_id == event_id, models.Registration.email == email
        )
        .first()
    )


def create_registration(db: Session, event_id: str, reg: schemas.RegistrationCreate):
    db_reg = models.Registration(event_id=event_id, **reg.model_dump())
    db.add(db_reg)
    db.commit()
    db.refresh(db_reg)
    return db_reg


def get_registrations_for_event(db: Session, event_id: str):
    return (
        db.query(models.Registration)
        .filter(models.Registration.event_id == event_id)
        .all()
    )


def delete_registration(db: Session, reg_id: str):
    db_reg = (
        db.query(models.Registration).filter(models.Registration.id == reg_id).first()
    )
    if not db_reg:
        return False
    db.delete(db_reg)
    db.commit()
    return True


def create_feedback(db: Session, event_id: str, fb: schemas.FeedbackCreate):
    db_fb = models.Feedback(event_id=event_id, **fb.model_dump())
    db.add(db_fb)
    db.commit()
    db.refresh(db_fb)
    return db_fb


def get_feedback_for_event(db: Session, event_id: str):
    return db.query(models.Feedback).filter(models.Feedback.event_id == event_id).all()


def get_admin_by_username(db: Session, username: str):
    return (
        db.query(models.Administrator)
        .filter(models.Administrator.username == username)
        .first()
    )


def create_admin(db: Session, username: str, hashed_pw: str):
    db_admin = models.Administrator(username=username, hashed_password=hashed_pw)
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin
