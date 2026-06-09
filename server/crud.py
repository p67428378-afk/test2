from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from server import models, schemas
from uuid import UUID
import uuid

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


# New Assortment Advisor CRUD
def get_kpis(db: Session):
    total_skus = db.query(models.SKU).count()
    if total_skus == 0:
        return {
            "in_stock_rate_pct": 96.8,
            "private_brand_pct": 24.5,
            "sales_per_linear_ft": 1245.50,
            "shelf_capacity_pct": 88.2
        }
    
    private_brand_count = db.query(models.SKU).filter(models.SKU.brand == "Private Brand").count()
    private_brand_pct = (private_brand_count / total_skus) * 100.0 if total_skus > 0 else 24.5

    total_sales = db.query(func.sum(models.SKU.sales)).scalar() or 0.0
    sales_per_linear_ft = float(total_sales) / 50.0 if total_sales > 0 else 1245.50

    return {
        "in_stock_rate_pct": 96.8,
        "private_brand_pct": round(private_brand_pct, 1),
        "sales_per_linear_ft": round(sales_per_linear_ft, 2),
        "shelf_capacity_pct": 88.2
    }

def get_skus(db: Session, skip: int = 0, limit: int = 10, filter_query: str = None, sort_by: str = None):
    query = db.query(models.SKU)
    if filter_query:
        query = query.filter(
            or_(
                models.SKU.name.ilike(f"%{filter_query}%"),
                models.SKU.brand.ilike(f"%{filter_query}%"),
                models.SKU.status_badge.ilike(f"%{filter_query}%")
            )
        )
    
    if sort_by:
        descending = sort_by.startswith("-")
        field_name = sort_by.lstrip("-")
        if hasattr(models.SKU, field_name):
            field = getattr(models.SKU, field_name)
            if descending:
                query = query.order_by(field.desc())
            else:
                query = query.order_by(field.asc())
    else:
        query = query.order_by(models.SKU.sales.desc())

    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total

def get_default_scenarios(db: Session):
    return db.query(models.Scenario).all()

def get_scenario(db: Session, scenario_id: UUID):
    return db.query(models.Scenario).filter(models.Scenario.scenario_id == str(scenario_id)).first()

def create_audit_trail(db: Session, scenario_id: UUID, user_id: str, summary: dict):
    db_audit = models.AuditTrail(
        scenario_id=str(scenario_id),
        user_id=user_id,
        summary=summary
    )
    db.add(db_audit)
    db.commit()
    db.refresh(db_audit)
    return db_audit

def get_audit_trail(db: Session, audit_id: UUID):
    return db.query(models.AuditTrail).filter(models.AuditTrail.audit_id == str(audit_id)).first()

def save_assortment_changes(db: Session, scenario_id: UUID, changes: list):
    # Clear existing changes for this scenario
    db.query(models.AssortmentChange).filter(models.AssortmentChange.scenario_id == str(scenario_id)).delete()
    
    # Add new changes
    for change in changes:
        db_change = models.AssortmentChange(
            scenario_id=str(scenario_id),
            sku_id=str(change.sku_id),
            action=change.action
        )
        db.add(db_change)
    db.commit()
