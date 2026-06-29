"""
Module: crud
Purpose: Database CRUD operations for users, otps, password history, items, auctions, and bids.
"""

import hashlib
import uuid
from sqlalchemy.orm import Session
from typing import Optional
from server import models, schemas


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_user(db: Session, user: schemas.UserRegisterRequest):
    hashed_password = hash_password(user.password)
    security_answer_hash = hash_password(user.security_answer)
    db_user = models.User(
        login_id=user.login_id,
        mobile_number=user.mobile_number,
        hashed_password=hashed_password,
        security_question=user.security_question,
        security_answer_hash=security_answer_hash,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(
        user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp


def get_otp(db: Session, otp_session_id: str):
    try:
        uuid_obj = (
            uuid.UUID(otp_session_id)
            if isinstance(otp_session_id, str)
            else otp_session_id
        )
    except ValueError:
        return None
    return db.query(models.OTP).filter(models.OTP.id == uuid_obj).first()


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


# Items, Auctions, and Bids CRUD
def get_items(
    db: Session, skip: int = 0, limit: int = 20, status: Optional[str] = None
):
    query = db.query(models.Item)
    if status:
        query = query.join(models.Auction).filter(models.Auction.status == status)
    query = query.order_by(models.Item.created_at.desc())
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total


def get_item_by_id(db: Session, item_id: str):
    try:
        uuid_obj = uuid.UUID(item_id) if isinstance(item_id, str) else item_id
    except ValueError:
        return None
    return db.query(models.Item).filter(models.Item.id == uuid_obj).first()


def create_bid(db: Session, auction_id: str, user_id: str, amount: float):
    try:
        auction_uuid = (
            uuid.UUID(auction_id) if isinstance(auction_id, str) else auction_id
        )
        user_uuid = uuid.UUID(user_id) if isinstance(user_id, str) else user_id
    except ValueError:
        return None
    db_bid = models.Bid(auction_id=auction_uuid, user_id=user_uuid, amount=amount)
    db.add(db_bid)
    auction = db.query(models.Auction).filter(models.Auction.id == auction_uuid).first()
    if auction:
        auction.current_highest_bid = amount
    db.commit()
    db.refresh(db_bid)
    return db_bid
