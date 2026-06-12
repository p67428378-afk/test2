from sqlalchemy.orm import Session
from uuid import UUID
from server import models, schemas

def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()

def get_user_by_mobile_number(db: Session, mobile_number: str):
    return db.query(models.User).filter(models.User.mobile_number == mobile_number).first()

def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at)
    db.add(db_otp)
    db.commit()
    db_otp = db.merge(db_otp) # Use merge or refresh to avoid detached instance issues
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

# Trail CRUD
def get_trail_by_id(db: Session, trail_id: UUID):
    return db.query(models.Trail).filter(models.Trail.id == trail_id).first()

def get_trail_by_name(db: Session, name: str):
    return db.query(models.Trail).filter(models.Trail.name == name).first()

def get_all_trails(db: Session):
    return db.query(models.Trail).all()

def create_trail(db: Session, trail: schemas.TrailCreate):
    db_trail = models.Trail(name=trail.name, status=trail.status)
    db.add(db_trail)
    db.commit()
    db.refresh(db_trail)
    return db_trail

def update_trail_status(db: Session, trail_id: UUID, status: str):
    db_trail = get_trail_by_id(db, trail_id)
    if db_trail:
        db_trail.status = status
        db.commit()
        db.refresh(db_trail)
    return db_trail

# Trail Report CRUD
def get_all_trail_reports(db: Session):
    return db.query(models.TrailReport).all()

def create_trail_report(db: Session, report: schemas.TrailReportCreate):
    db_report = models.TrailReport(
        trail_id=report.trail_id,
        user_id=report.user_id,
        condition=report.condition,
        notes=report.notes,
        media_url=report.media_url
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

# Wildlife Sighting CRUD
def get_all_wildlife_sightings(db: Session):
    return db.query(models.WildlifeSighting).all()

def create_wildlife_sighting(db: Session, sighting: schemas.WildlifeSightingCreate):
    db_sighting = models.WildlifeSighting(
        user_id=sighting.user_id,
        species=sighting.species,
        count=sighting.count,
        location=sighting.location,
        notes=sighting.notes
    )
    db.add(db_sighting)
    db.commit()
    db.refresh(db_sighting)
    return db_sighting

# Access Rule CRUD
def get_all_access_rules(db: Session):
    return db.query(models.AccessRule).all()

def create_access_rule(db: Session, rule: schemas.AccessRuleCreate):
    db_rule = models.AccessRule(
        trail_id=rule.trail_id,
        is_closed=rule.is_closed,
        reason=rule.reason,
        start_time=rule.start_time,
        end_time=rule.end_time
    )
    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)
    return db_rule
