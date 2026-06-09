from sqlalchemy.orm import Session
from sqlalchemy import func
from server import models, schemas
from typing import Optional, List

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

# Assortment Advisor CRUD
def calculate_sku_status(scenario_name: str, sales_velocity: float, margin_pct: float) -> str:
    scenario = (scenario_name or "Balanced").lower()
    if "conservative" in scenario:
        if sales_velocity > 100 and margin_pct > 35:
            return "GROW"
        elif sales_velocity > 70:
            return "MAINTAIN"
        elif sales_velocity < 15:
            return "SWAP"
        else:
            return "REDUCE"
    elif "aggressive" in scenario:
        if sales_velocity > 80 and margin_pct > 25:
            return "GROW"
        elif sales_velocity > 90:
            return "MAINTAIN"
        elif sales_velocity < 25:
            return "SWAP"
        else:
            return "REDUCE"
    else:  # Balanced
        if sales_velocity > 90 and margin_pct > 30:
            return "GROW"
        elif sales_velocity > 80:
            return "MAINTAIN"
        elif sales_velocity < 20:
            return "SWAP"
        else:
            return "REDUCE"

def get_kpis_by_scenario(db: Session, scenario_name: str):
    kpi = db.query(models.KPI).filter(func.lower(models.KPI.scenario_name) == func.lower(scenario_name)).first()
    if not kpi:
        kpi = db.query(models.KPI).filter(func.lower(models.KPI.scenario_name) == "balanced").first()
    return kpi

def get_skus(db: Session, scenario_name: str, search: Optional[str] = None, sort_by: Optional[str] = None, sort_order: Optional[str] = None, skip: int = 0, limit: int = 50):
    query = db.query(models.Product)
    if search:
        query = query.filter(models.Product.sku_name.ilike(f"%{search}%"))
    
    if sort_by:
        col = getattr(models.Product, sort_by, None)
        if col:
            if sort_order == "desc":
                query = query.order_by(col.desc())
            else:
                query = query.order_by(col.asc())
    else:
        query = query.order_by(models.Product.sku_name.asc())

    total = query.count()
    products = query.offset(skip).limit(limit).all()

    items = []
    for p in products:
        status = calculate_sku_status(scenario_name, p.sales_velocity, p.margin_pct)
        items.append(schemas.SKUItem(
            id=p.id,
            sku_name=p.sku_name,
            sales_velocity=p.sales_velocity,
            margin_pct=p.margin_pct,
            current_inventory=p.current_inventory,
            status=status
        ))
    
    return items, total

def get_scenarios(db: Session, selected_scenario_name: str = "Balanced"):
    scenarios = db.query(models.AssortmentScenario).all()
    result = []
    for s in scenarios:
        is_selected = s.name.lower() == selected_scenario_name.lower()
        result.append(schemas.ScenarioResponse(
            name=s.name,
            sales_lift=s.sales_lift,
            pb_change=s.pb_change,
            description=s.description,
            is_selected=is_selected
        ))
    return result

def create_assortment_plan_audit(db: Session, tracking_id: str, scenario_name: str, submitted_by: str, sku_actions_json: str):
    audit = models.AssortmentPlanAudit(
        tracking_id=tracking_id,
        scenario_name=scenario_name,
        submitted_by=submitted_by,
        sku_actions_json=sku_actions_json
    )
    db.add(audit)
    db.commit()
    db.refresh(audit)
    return audit
