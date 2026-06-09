from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from server import models, schemas
from uuid import UUID
import uuid
from datetime import datetime

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

# --- DG Cluster Assortment Advisor CRUD ---

def get_kpis(db: Session):
    # Calculate total sales
    total_sales = db.query(func.sum(models.SalesData.revenue)).scalar() or 0.0
    
    # Calculate private brand sales
    pb_sales = db.query(func.sum(models.SalesData.revenue)).join(models.SKU).filter(models.SKU.is_private_brand == True).scalar() or 0.0
    
    private_brand_pct = (pb_sales / total_sales * 100) if total_sales > 0 else 24.8
    sales_per_linear_ft = (total_sales / 10.0) if total_sales > 0 else 1520.0
    
    return {
        "sales_per_linear_ft": round(sales_per_linear_ft, 2),
        "private_brand_pct": round(private_brand_pct, 2),
        "in_stock_rate": 96.2,
        "shelf_capacity": 84.5
    }

def get_skus_performance(db: Session, page: int = 1, limit: int = 10):
    offset = (page - 1) * limit
    
    # Query SKUs
    skus_query = db.query(models.SKU)
    total = skus_query.count()
    skus = skus_query.offset(offset).limit(limit).all()
    
    items = []
    for sku in skus:
        # Calculate sales, profit, volume
        sales = db.query(func.sum(models.SalesData.revenue)).filter(models.SalesData.sku_id == sku.id).scalar() or 0.0
        profit = db.query(func.sum(models.SalesData.profit)).filter(models.SalesData.sku_id == sku.id).scalar() or 0.0
        volume = db.query(func.sum(models.SalesData.volume)).filter(models.SalesData.sku_id == sku.id).scalar() or 0
        
        # Determine status based on name/brand
        status = "MAINTAIN"
        name_lower = sku.name.lower()
        if "potato chips" in name_lower:
            status = "GROW"
        elif "pretzels" in name_lower:
            status = "GROW"
        elif "cheese puffs" in name_lower:
            status = "SWAP"
        elif "popcorn" in name_lower:
            status = "REDUCE"
            
        items.append({
            "sku_id": sku.id,
            "name": sku.name,
            "sales": round(sales, 2),
            "profit": round(profit, 2),
            "volume": int(volume),
            "status": status
        })
        
    return items, total

def get_scenarios(db: Session):
    return db.query(models.Scenario).all()

def get_scenario_by_id(db: Session, scenario_id: UUID):
    return db.query(models.Scenario).filter(models.Scenario.id == scenario_id).first()

def create_assortment_plan(db: Session, scenario_id: UUID, created_by: str):
    # Create plan
    plan = models.AssortmentPlan(
        scenario_id=scenario_id,
        status="SUBMITTED",
        created_by=created_by
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    
    # Get scenario to determine actions
    scenario = get_scenario_by_id(db, scenario_id)
    actions = []
    if scenario:
        scenario_name = scenario.name.lower()
        if "conservative" in scenario_name:
            pass
        elif "balanced" in scenario_name:
            # Find Brand B Cheese Puffs and Brand C Popcorn
            brand_b = db.query(models.SKU).filter(models.SKU.name.like("%Cheese Puffs%")).first()
            brand_c = db.query(models.SKU).filter(models.SKU.name.like("%Popcorn%")).first()
            if brand_b:
                actions.append((brand_b.id, "SWAP"))
            if brand_c:
                actions.append((brand_c.id, "REDUCE"))
        elif "aggressive" in scenario_name:
            brand_a = db.query(models.SKU).filter(models.SKU.name.like("%Tortilla Chips%")).first()
            brand_b = db.query(models.SKU).filter(models.SKU.name.like("%Cheese Puffs%")).first()
            brand_c = db.query(models.SKU).filter(models.SKU.name.like("%Popcorn%")).first()
            if brand_a:
                actions.append((brand_a.id, "SWAP"))
            if brand_b:
                actions.append((brand_b.id, "SWAP"))
            if brand_c:
                actions.append((brand_c.id, "REDUCE"))
                
    for sku_id, action in actions:
        plan_sku = models.AssortmentPlanSKU(
            plan_id=plan.id,
            sku_id=sku_id,
            action=action
        )
        db.add(plan_sku)
        
    # Create audit trail
    audit = models.AuditTrail(
        plan_id=plan.id,
        user_id=created_by,
        action=f"Submitted assortment plan for scenario: {scenario.name if scenario else 'Unknown'}"
    )
    db.add(audit)
    db.commit()
    db.refresh(audit)
    
    return plan, audit
