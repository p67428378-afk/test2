from sqlalchemy.orm import Session
from server import models
from uuid import UUID
from typing import Optional


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
    otp.is_used = True  # type: ignore
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
    user.hashed_password = hashed_password  # type: ignore
    db.commit()
    db.refresh(user)
    return user


# Product CRUD
def get_products(db: Session):
    return db.query(models.Product).all()


def get_product(db: Session, product_id: UUID):
    return (
        db.query(models.Product).filter(models.Product.product_id == product_id).first()
    )


def create_product(
    db: Session,
    name: str,
    category: str,
    aum_contribution: float,
    npa_percentage: float,
    status: str,
    product_id: Optional[UUID] = None,
):
    db_product = models.Product(
        name=name,
        category=category,
        aum_contribution=aum_contribution,
        npa_percentage=npa_percentage,
        status=status,
    )
    if product_id:
        db_product.product_id = product_id  # type: ignore
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


# Decision Log CRUD
def create_decision_log(
    db: Session, user_id: str, scenario_name: str, guardrails_passed: dict
):
    db_log = models.DecisionLog(
        user_id=user_id,
        scenario_name=scenario_name,
        guardrails_passed=guardrails_passed,
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


def create_decision_product(
    db: Session, log_id: UUID, product_id: UUID, recommended_action: str
):
    db_dp = models.DecisionProduct(
        log_id=log_id, product_id=product_id, recommended_action=recommended_action
    )
    db.add(db_dp)
    db.commit()
    db.refresh(db_dp)
    return db_dp
