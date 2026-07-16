from sqlalchemy.orm import Session
from server import models, schemas
from uuid import UUID
from datetime import datetime

# Keep existing CRUD functions for backward compatibility
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()

def get_user_by_mobile_number(db: Session, mobile_number: str):
    return db.query(models.User).filter(models.User.mobile_number == mobile_number).first()

def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at)
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
    db_password_history = models.PasswordHistory(user_id=user_id, hashed_password=hashed_password)
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history

def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user


# Wildlife Conservation System CRUD
def get_animals(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Animal).offset(skip).limit(limit).all()

def get_animal(db: Session, animal_id: UUID):
    return db.query(models.Animal).filter(models.Animal.id == animal_id).first()

def create_animal(db: Session, animal: schemas.AnimalCreate):
    db_animal = models.Animal(
        name=animal.name,
        species=animal.species,
        gps_tag_id=animal.gps_tag_id
    )
    db.add(db_animal)
    db.commit()
    db.refresh(db_animal)
    return db_animal

def create_gps_location(db: Session, location: schemas.GPSLocationCreate):
    db_location = models.GPSLocation(
        animal_id=location.animal_id,
        latitude=location.latitude,
        longitude=location.longitude,
        timestamp=location.timestamp
    )
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

def get_animal_locations(db: Session, animal_id: UUID, start_date: datetime = None, end_date: datetime = None):
    query = db.query(models.GPSLocation).filter(models.GPSLocation.animal_id == animal_id)
    if start_date:
        query = query.filter(models.GPSLocation.timestamp >= start_date)
    if end_date:
        query = query.filter(models.GPSLocation.timestamp <= end_date)
    return query.order_by(models.GPSLocation.timestamp.asc()).all()

def create_health_examination(db: Session, exam: schemas.HealthExaminationCreate):
    db_exam = models.HealthExamination(
        animal_id=exam.animal_id,
        examination_date=exam.examination_date,
        veterinarian=exam.veterinarian,
        health_status=exam.health_status,
        notes=exam.notes
    )
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

def get_health_examinations(db: Session, animal_id: UUID = None, skip: int = 0, limit: int = 100):
    query = db.query(models.HealthExamination)
    if animal_id:
        query = query.filter(models.HealthExamination.animal_id == animal_id)
    return query.order_by(models.HealthExamination.examination_date.desc()).offset(skip).limit(limit).all()

def get_protected_zones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ProtectedZone).offset(skip).limit(limit).all()

def get_protected_zone(db: Session, zone_id: UUID):
    return db.query(models.ProtectedZone).filter(models.ProtectedZone.id == zone_id).first()

def create_protected_zone(db: Session, zone: schemas.ProtectedZoneCreate):
    db_zone = models.ProtectedZone(
        name=zone.name,
        area=zone.area
    )
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    return db_zone

def update_protected_zone(db: Session, zone_id: UUID, zone_update: schemas.ProtectedZoneCreate):
    db_zone = get_protected_zone(db, zone_id)
    if db_zone:
        db_zone.name = zone_update.name
        db_zone.area = zone_update.area
        db.commit()
        db.refresh(db_zone)
    return db_zone

def delete_protected_zone(db: Session, zone_id: UUID):
    db_zone = get_protected_zone(db, zone_id)
    if db_zone:
        db.delete(db_zone)
        db.commit()
        return True
    return False
