from sqlalchemy.orm import Session
from server import models
from datetime import date


# Existing functions for password reset microservice
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


# New functions for Gym Membership Value Analyzer
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, email: str, password_hash: str):
    db_user = models.User(email=email, password_hash=password_hash)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_membership(
    db: Session, user_id: str, gym_name: str, membership_type: str, monthly_fee: float
):
    db_membership = models.Membership(
        user_id=user_id,
        gym_name=gym_name,
        membership_type=membership_type,
        monthly_fee=monthly_fee,
    )
    db.add(db_membership)
    db.commit()
    db.refresh(db_membership)
    return db_membership


def get_memberships_by_user(db: Session, user_id: str):
    return (
        db.query(models.Membership)
        .filter(models.Membership.user_id == user_id)
        .order_by(models.Membership.created_at)
        .all()
    )


def get_membership_by_id(db: Session, membership_id: str):
    return (
        db.query(models.Membership)
        .filter(models.Membership.id == membership_id)
        .first()
    )


def create_visit(db: Session, membership_id: str, visit_date: date):
    db_visit = models.Visit(membership_id=membership_id, visit_date=visit_date)
    db.add(db_visit)
    db.commit()
    db.refresh(db_visit)
    return db_visit


def get_visits_by_user(db: Session, user_id: str, membership_id: str = None):
    query = (
        db.query(models.Visit)
        .join(models.Membership)
        .filter(models.Membership.user_id == user_id)
    )
    if membership_id:
        query = query.filter(models.Visit.membership_id == membership_id)
    return query.order_by(models.Visit.visit_date.desc()).all()


def get_notification_settings_by_user(db: Session, user_id: str):
    return (
        db.query(models.NotificationSettings)
        .filter(models.NotificationSettings.user_id == user_id)
        .first()
    )


def create_default_notification_settings(db: Session, user_id: str):
    db_settings = models.NotificationSettings(user_id=user_id)
    db.add(db_settings)
    db.commit()
    db.refresh(db_settings)
    return db_settings


def update_notification_settings(
    db: Session,
    user_id: str,
    inactive_days_threshold: int = None,
    cost_per_visit_threshold: float = None,
    email_notifications_enabled: bool = None,
):
    db_settings = get_notification_settings_by_user(db, user_id)
    if not db_settings:
        db_settings = models.NotificationSettings(user_id=user_id)
        db.add(db_settings)

    if inactive_days_threshold is not None:
        db_settings.inactive_days_threshold = inactive_days_threshold
    if cost_per_visit_threshold is not None:
        db_settings.cost_per_visit_threshold = cost_per_visit_threshold
    if email_notifications_enabled is not None:
        db_settings.email_notifications_enabled = email_notifications_enabled

    db.commit()
    db.refresh(db_settings)
    return db_settings
