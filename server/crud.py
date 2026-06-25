from sqlalchemy.orm import Session
from uuid import UUID
from server import models, schemas


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


# Payment CRUD
def create_user_saved_card(
    db: Session, user_id: UUID, card_data: schemas.PaymentTokenCreate
):
    db_card = models.UserSavedCard(
        user_id=user_id,
        payment_gateway_token=card_data.payment_token,
        card_last_four=card_data.card_last_four,
        card_brand=card_data.card_brand,
        card_expiry_date=card_data.card_expiry_date,
    )
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card


def get_user_saved_cards(db: Session, user_id: UUID, skip: int = 0, limit: int = 100):
    return (
        db.query(models.UserSavedCard)
        .filter(models.UserSavedCard.user_id == user_id)
        .order_by(models.UserSavedCard.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_user_saved_card_by_id(db: Session, card_id: UUID, user_id: UUID):
    return (
        db.query(models.UserSavedCard)
        .filter(
            models.UserSavedCard.id == card_id, models.UserSavedCard.user_id == user_id
        )
        .first()
    )


def delete_user_saved_card(db: Session, card_id: UUID, user_id: UUID) -> bool:
    db_card = get_user_saved_card_by_id(db, card_id, user_id)
    if db_card:
        db.delete(db_card)
        db.commit()
        return True
    return False
