from sqlalchemy.orm import Session
from server import models
from uuid import UUID


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


# Notification CRUD
def get_notification(db: Session, notification_id: UUID):
    return (
        db.query(models.Notification)
        .filter(models.Notification.id == notification_id)
        .first()
    )


def get_notifications_by_user(db: Session, user_id: UUID):
    query = db.query(models.Notification).filter(models.Notification.user_id == user_id)
    total = query.count()
    items = query.order_by(models.Notification.created_at.desc()).all()
    return items, total


def create_notification(
    db: Session, user_id: UUID, transaction_id: str, amount: float, merchant: str
):
    db_notification = models.Notification(
        user_id=user_id,
        transaction_id=transaction_id,
        amount=amount,
        merchant=merchant,
        status="PENDING",
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification
