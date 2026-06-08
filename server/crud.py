from sqlalchemy.orm import Session
from server import models, schemas
from datetime import datetime

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

# New Mobile Number Update CRUD
def get_user_by_account_number(db: Session, account_number: str):
    return db.query(models.User).filter(models.User.account_number == account_number).first()

def create_mobile_update_request(
    db: Session,
    account_number: str,
    old_mobile_number: str,
    new_mobile_number: str,
    old_mobile_hash: str,
    new_mobile_hash: str
):
    db_request = models.MobileUpdateRequest(
        account_number=account_number,
        old_mobile_number=old_mobile_number,
        new_mobile_number=new_mobile_number,
        old_mobile_hash=old_mobile_hash,
        new_mobile_hash=new_mobile_hash,
        status="PENDING_OLD_OTP"
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def get_mobile_update_request(db: Session, request_id: str):
    return db.query(models.MobileUpdateRequest).filter(models.MobileUpdateRequest.id == request_id).first()

def update_mobile_update_request_status(db: Session, request: models.MobileUpdateRequest, status: str):
    request.status = status
    db.commit()
    db.refresh(request)
    return request

def create_otp_verification(
    db: Session,
    request_id: str,
    otp_hash: str,
    mobile_number_type: str,
    expires_at: datetime
):
    db_verification = models.OTPVerification(
        request_id=request_id,
        otp_hash=otp_hash,
        mobile_number_type=mobile_number_type,
        expires_at=expires_at
    )
    db.add(db_verification)
    db.commit()
    db.refresh(db_verification)
    return db_verification

def get_active_otp_verification(db: Session, request_id: str, mobile_number_type: str):
    return db.query(models.OTPVerification).filter(
        models.OTPVerification.request_id == request_id,
        models.OTPVerification.mobile_number_type == mobile_number_type,
        models.OTPVerification.verified_at.is_(None)
    ).order_by(models.OTPVerification.created_at.desc()).first()

def mark_otp_verification_verified(db: Session, otp_verification: models.OTPVerification):
    otp_verification.verified_at = datetime.utcnow()
    db.commit()
    db.refresh(otp_verification)
    return otp_verification

def update_user_mobile_number(db: Session, user: models.User, new_mobile_number: str):
    user.mobile_number = new_mobile_number
    db.commit()
    db.refresh(user)
    return user
