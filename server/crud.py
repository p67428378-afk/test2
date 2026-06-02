
from sqlalchemy.orm import Session
from server import models, schemas
from uuid import UUID
from datetime import date, timedelta

def get_pandit_availability(db: Session, pandit_id: UUID, month: int, year: int):
    return db.query(models.PanditAvailability).filter(
        models.PanditAvailability.pandit_id == pandit_id,
        models.PanditAvailability.date.between(date(year, month, 1), date(year, month, 31))
    ).all()

def update_pandit_availability(db: Session, pandit_id: UUID, availability_update: schemas.AvailabilityUpdate):
    for d in availability_update.dates:
        db_availability = db.query(models.PanditAvailability).filter(
            models.PanditAvailability.pandit_id == pandit_id,
            models.PanditAvailability.date == d
        ).first()
        if db_availability:
            db_availability.is_blocked = availability_update.is_blocked
        else:
            db_availability = models.PanditAvailability(
                pandit_id=pandit_id,
                date=d,
                is_blocked=availability_update.is_blocked
            )
            db.add(db_availability)
    db.commit()
    return {"status": "success"}

def get_pandit_shifts(db: Session, pandit_id: UUID):
    return db.query(models.PanditShift).filter(models.PanditShift.pandit_id == pandit_id).all()

def get_daily_agenda(db: Session, pandit_id: UUID, agenda_date: date):
    return db.query(models.Booking).filter(
        models.Booking.pandit_id == pandit_id,
        models.Booking.booking_time >= agenda_date,
        models.Booking.booking_time < agenda_date + timedelta(days=1)
    ).all()

def get_devotee_sankalpa_details(db: Session, devotee_id: UUID):
    return db.query(models.Devotee).filter(models.Devotee.id == devotee_id).first()
