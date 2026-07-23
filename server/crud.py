from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from server import models, schemas


# Existing CRUD functions
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


# New CRUD functions for Worklist and Auth
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_worklist_items(
    db: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 20,
    since: Optional[datetime] = None,
):
    query = db.query(models.WorklistItem).filter(models.WorklistItem.user_id == user_id)
    if since:
        query = query.filter(models.WorklistItem.updated_at >= since)
    # Sort by created_at descending or ascending? The HLD says "sorted by creation date"
    # Let's sort by created_at descending to show newest first, or ascending. Let's do descending.
    return (
        query.order_by(models.WorklistItem.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_worklist_total(db: Session, user_id: str, since: Optional[datetime] = None):
    query = db.query(models.WorklistItem).filter(models.WorklistItem.user_id == user_id)
    if since:
        query = query.filter(models.WorklistItem.updated_at >= since)
    return query.count()


def create_worklist_item(db: Session, user_id: str, item: schemas.WorklistItemCreate):
    db_item = models.WorklistItem(
        user_id=user_id, title=item.title, status=item.status or "pending"
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
