
from sqlalchemy.orm import Session
from server.app.models.password_reset import PasswordResetAttempt, OTP, User
import uuid
from datetime import datetime, timedelta

def get_user_by_login_id(db: Session, *, login_id: str) -> User:
    return db.query(User).filter(User.login_id == login_id).first()

def create_password_reset_attempt(db: Session, *, user_id: uuid.UUID) -> PasswordResetAttempt:
    db_obj = PasswordResetAttempt(user_id=user_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_password_reset_attempt(db: Session, *, user_id: uuid.UUID) -> PasswordResetAttempt:
    return db.query(PasswordResetAttempt).filter(PasswordResetAttempt.user_id == user_id).first()

def update_password_reset_attempt(db: Session, *, db_obj: PasswordResetAttempt, obj_in) -> PasswordResetAttempt:
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.dict(exclude_unset=True)
    for field in update_data:
        if hasattr(db_obj, field):
            setattr(db_obj, field, update_data[field])
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def create_otp(db: Session, *, user_id: uuid.UUID, otp_hash: str, expires_at: datetime) -> OTP:
    db_obj = OTP(user_id=user_id, otp_code_hash=otp_hash, expires_at=expires_at)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_otp(db: Session, *, user_id: uuid.UUID) -> OTP:
    return db.query(OTP).filter(OTP.user_id == user_id, OTP.used == False, OTP.expires_at > datetime.utcnow()).order_by(OTP.created_at.desc()).first()

def mark_otp_as_used(db: Session, *, db_obj: OTP) -> OTP:
    db_obj.used = True
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_user_password(db: Session, *, user: User, password_hash: str):
    user.password_hash = password_hash
    user.last_password_reset_at = datetime.utcnow()
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
