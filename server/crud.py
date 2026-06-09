from sqlalchemy.orm import Session
from server import models, schemas
from typing import Optional

# Existing Password Reset CRUD
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

# New Calculator CRUD
def create_calculation(
    db: Session,
    operand1: float,
    operand2: float,
    operator: str,
    result: Optional[float],
    formula: str,
    status: str
):
    db_calc = models.Calculation(
        operand1=operand1,
        operand2=operand2,
        operator=operator,
        result=result,
        formula=formula,
        status=status
    )
    db.add(db_calc)
    db.commit()
    db.refresh(db_calc)
    return db_calc

def get_calculations(db: Session, limit: int = 100):
    return db.query(models.Calculation).order_by(models.Calculation.created_at.desc()).limit(limit).all()

def clear_calculations(db: Session):
    db.query(models.Calculation).delete()
    db.commit()
    return {"message": "Calculation history cleared successfully"}
