"""
Module: server/crud.py
Purpose: CRUD operations for password reset and assortment advisor.
Author: Backend Developer Agent
Created: 2026-06-09
"""

from sqlalchemy.orm import Session
from datetime import date, datetime
from server import models, schemas

# --- Password Reset CRUD ---

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

# --- Assortment Advisor CRUD ---

def get_latest_kpis(db: Session) -> schemas.DashboardResponse:
    """Fetch the latest KPI values from the database."""
    kpis = db.query(models.KPIData).all()
    
    # Default values if not seeded
    data = {
        "sales_per_linear_ft": 1245.50,
        "private_brand_percent": 15.4,
        "in_stock_rate": 96.8,
        "shelf_capacity_percent": 88.2
    }
    
    for kpi in kpis:
        if kpi.kpi_name in data:
            data[kpi.kpi_name] = kpi.value
            
    return schemas.DashboardResponse(
        sales_per_linear_ft=data["sales_per_linear_ft"],
        private_brand_percent=data["private_brand_percent"],
        in_stock_rate=data["in_stock_rate"],
        shelf_capacity_percent=data["shelf_capacity_percent"]
    )

def get_sku_performance(db: Session):
    """Fetch SKU performance data joined with product details."""
    results = db.query(models.SKUPerformance).join(models.Product).all()
    
    # If not seeded, return empty list or we can return default mock list
    performance_list = []
    for item in results:
        performance_list.append(schemas.SKUPerformanceResponse(
            id=item.id,
            sku=item.product.sku,
            product_name=item.product.name,
            sales=item.sales,
            units=item.units,
            profit_margin=item.profit_margin,
            days_of_supply=item.days_of_supply,
            status_badge=item.status_badge,
            is_private_brand=item.product.is_private_brand
        ))
    return performance_list

def get_scenarios(db: Session):
    """Fetch all assortment scenarios."""
    return db.query(models.Scenario).all()

def create_submission(db: Session, scenario_id: str, user_id: str):
    """Create a new assortment submission."""
    # Verify scenario exists
    scenario = db.query(models.Scenario).filter(models.Scenario.id == scenario_id).first()
    if not scenario:
        return None
        
    submission = models.AssortmentSubmission(
        scenario_id=scenario_id,
        user_id=user_id,
        status="Submitted",
        submission_time=datetime.utcnow()
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission

def seed_database(db: Session):
    """Seed the database with initial mock data."""
    # Clear existing data to avoid duplicates
    db.query(models.AssortmentSubmission).delete()
    db.query(models.Scenario).delete()
    db.query(models.SKUPerformance).delete()
    db.query(models.KPIData).delete()
    db.query(models.Product).delete()
    db.commit()

    # 1. Seed Products
    products_data = [
        {"sku": "SKU-1001", "name": "Clover Valley Potato Chips 10oz", "category": "Snacks", "is_private_brand": True},
        {"sku": "SKU-1002", "name": "Lay's Classic Potato Chips 8oz", "category": "Snacks", "is_private_brand": False},
        {"sku": "SKU-1003", "name": "Clover Valley Tortilla Chips 12oz", "category": "Snacks", "is_private_brand": True},
        {"sku": "SKU-1004", "name": "Branded Cheese Puffs 6oz", "category": "Snacks", "is_private_brand": False},
        {"sku": "SKU-1005", "name": "Clover Valley Pretzels 16oz", "category": "Snacks", "is_private_brand": True},
    ]
    
    products_map = {}
    for p in products_data:
        product = models.Product(
            sku=p["sku"],
            name=p["name"],
            category=p["category"],
            is_private_brand=p["is_private_brand"]
        )
        db.add(product)
        db.flush()  # Get ID
        products_map[p["sku"]] = product

    # 2. Seed KPI Data
    kpis_data = [
        {"kpi_name": "sales_per_linear_ft", "value": 1245.50},
        {"kpi_name": "private_brand_percent", "value": 15.4},
        {"kpi_name": "in_stock_rate", "value": 96.8},
        {"kpi_name": "shelf_capacity_percent", "value": 88.2},
    ]
    for k in kpis_data:
        kpi = models.KPIData(
            date=date.today(),
            kpi_name=k["kpi_name"],
            value=k["value"]
        )
        db.add(kpi)

    # 3. Seed SKU Performance
    performance_data = [
        {"sku": "SKU-1001", "sales": 12450.0, "units": 5200, "profit_margin": 38.5, "days_of_supply": 14, "status_badge": "GROW"},
        {"sku": "SKU-1002", "sales": 18200.0, "units": 6500, "profit_margin": 22.0, "days_of_supply": 8, "status_badge": "MAINTAIN"},
        {"sku": "SKU-1003", "sales": 3100.0, "units": 1200, "profit_margin": 41.0, "days_of_supply": 28, "status_badge": "SWAP"},
        {"sku": "SKU-1004", "sales": 1200.0, "units": 450, "profit_margin": 15.0, "days_of_supply": 45, "status_badge": "REDUCE"},
        {"sku": "SKU-1005", "sales": 8900.0, "units": 3800, "profit_margin": 35.0, "days_of_supply": 12, "status_badge": "GROW"},
    ]
    for perf in performance_data:
        prod = products_map.get(perf["sku"])
        if prod:
            sku_perf = models.SKUPerformance(
                product_id=prod.id,
                date=date.today(),
                sales=perf["sales"],
                units=perf["units"],
                profit_margin=perf["profit_margin"],
                days_of_supply=perf["days_of_supply"],
                status_badge=perf["status_badge"]
            )
            db.add(sku_perf)

    # 4. Seed Scenarios
    scenarios_data = [
        {
            "name": "Conservative",
            "description": "Minimal changes, focusing on removing only the worst-performing SKUs.",
            "projected_sales_lift": 1.5,
            "projected_profit_margin": 31.0,
            "new_private_brand_percent": 15.5,
            "skus_to_add": 2,
            "skus_to_remove": 5,
            "skus_to_swap": 1
        },
        {
            "name": "Balanced",
            "description": "Moderate changes, balancing private brand growth and shelf space optimization.",
            "projected_sales_lift": 4.2,
            "projected_profit_margin": 34.5,
            "new_private_brand_percent": 18.2,
            "skus_to_add": 5,
            "skus_to_remove": 8,
            "skus_to_swap": 3
        },
        {
            "name": "Aggressive",
            "description": "High-impact changes, maximizing private brand penetration and shelf space efficiency.",
            "projected_sales_lift": 8.5,
            "projected_profit_margin": 38.0,
            "new_private_brand_percent": 22.0,
            "skus_to_add": 10,
            "skus_to_remove": 12,
            "skus_to_swap": 5
        }
    ]
    for s in scenarios_data:
        scenario = models.Scenario(
            name=s["name"],
            description=s["description"],
            projected_sales_lift=s["projected_sales_lift"],
            projected_profit_margin=s["projected_profit_margin"],
            new_private_brand_percent=s["new_private_brand_percent"],
            skus_to_add=s["skus_to_add"],
            skus_to_remove=s["skus_to_remove"],
            skus_to_swap=s["skus_to_swap"]
        )
        db.add(scenario)

    db.commit()
    return {"status": "success", "message": "Database seeded successfully"}
