from sqlalchemy.orm import Session
from server import models, schemas

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


# New DG Cluster Assortment Advisor CRUD

def get_all_skus(db: Session):
    return db.query(models.SKU).all()

def create_sku(db: Session, sku_name: str, current_sales: float, sales_per_linear_ft: float, private_brand: bool, in_stock_rate: float, shelf_capacity: int):
    db_sku = models.SKU(
        sku_name=sku_name,
        current_sales=current_sales,
        sales_per_linear_ft=sales_per_linear_ft,
        private_brand=private_brand,
        in_stock_rate=in_stock_rate,
        shelf_capacity=shelf_capacity
    )
    db.add(db_sku)
    db.commit()
    db.refresh(db_sku)
    return db_sku

def create_decision(db: Session, scenario_name: str, decisions_payload: dict, submitted_by: str):
    db_decision = models.Decision(
        scenario_name=scenario_name,
        decisions_payload=decisions_payload,
        submitted_by=submitted_by
    )
    db.add(db_decision)
    db.commit()
    db.refresh(db_decision)
    return db_decision
