from sqlalchemy.orm import Session
from server import models
from uuid import UUID
from datetime import date


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


# New CRUD functions for Assortment Advisor
def get_products(db: Session):
    return db.query(models.Product).all()


def get_product_by_upc(db: Session, upc: str):
    return db.query(models.Product).filter(models.Product.upc == upc).first()


def create_product(db: Session, upc: str, name: str, is_private_brand: bool = False):
    db_product = models.Product(upc=upc, name=name, is_private_brand=is_private_brand)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def create_performance_metric(
    db: Session,
    product_id: UUID,
    week_ending_date: date,
    weekly_sales: float,
    sales_rank_percentile: float,
    margin_percentage: float,
    in_stock_rate: float,
):
    db_metric = models.PerformanceMetric(
        product_id=product_id,
        week_ending_date=week_ending_date,
        weekly_sales=weekly_sales,
        sales_rank_percentile=sales_rank_percentile,
        margin_percentage=margin_percentage,
        in_stock_rate=in_stock_rate,
    )
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric


def create_assortment_decision(
    db: Session, scenario_name: str, decision_payload: dict, submitted_by: str
):
    db_decision = models.AssortmentDecision(
        scenario_name=scenario_name,
        decision_payload=decision_payload,
        submitted_by=submitted_by,
    )
    db.add(db_decision)
    db.commit()
    db.refresh(db_decision)
    return db_decision
