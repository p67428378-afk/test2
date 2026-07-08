from sqlalchemy.orm import Session
from server import models
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


def get_user_milestones(db: Session, user_id):
    # user_id can be str or UUID. Let's convert to UUID if it's a string.
    if isinstance(user_id, str):
        user_id = uuid.UUID(user_id)
    return (
        db.query(models.UserMilestone)
        .filter(models.UserMilestone.user_id == user_id)
        .all()
    )


def create_default_milestones(db: Session, user_id):
    if isinstance(user_id, str):
        user_id = uuid.UUID(user_id)
    milestones = [
        {
            "target_amount": 10.00,
            "reward_text": "You've invested $10 entirely from spare change! That's equivalent to 2 free coffees working for your future.",
        },
        {
            "target_amount": 25.00,
            "reward_text": "You've invested $25 entirely from spare change! That's equivalent to 5 free coffees working for your future.",
        },
        {
            "target_amount": 50.00,
            "reward_text": "You've invested $50 entirely from spare change! That's equivalent to 10 free coffees working for your future.",
        },
        {
            "target_amount": 100.00,
            "reward_text": "You've invested $100 entirely from spare change! That's equivalent to 20 free coffees working for your future.",
        },
    ]
    db_milestones = []
    for m in milestones:
        db_m = models.UserMilestone(
            user_id=user_id,
            target_amount=m["target_amount"],
            reward_text=m["reward_text"],
            is_achieved=False,
            achieved_at=None,
        )
        db.add(db_m)
        db_milestones.append(db_m)
    db.commit()
    return db_milestones
