from sqlalchemy.orm import Session
from server import models, schemas
import uuid
from datetime import datetime

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
def get_scenarios(db: Session):
    return db.query(models.Scenario).all()

def get_scenario(db: Session, scenario_id: str):
    try:
        scenario_uuid = uuid.UUID(scenario_id)
    except ValueError:
        return None
    return db.query(models.Scenario).filter(models.Scenario.id == scenario_uuid).first()

def create_scenario(db: Session, scenario_in: schemas.ScenarioCreateRequest):
    # Determine metrics based on strategy type
    strategy = scenario_in.strategy_type.capitalize()
    if strategy == "Conservative":
        projected_sales_lift = 2.5
        private_brand_percentage = 22.0
        in_stock_rate = 98.5
        shelf_space_utilized = 80.0
        sku_actions_data = [
            {"sku_id": "SKU-40129", "product_name": "Clover Valley Potato Chips 10oz", "brand": "Clover Valley [Private Brand]", "action": "KEEP", "sales_impact": 1450.0},
            {"sku_id": "SKU-40130", "product_name": "Lay's Classic 13oz", "brand": "Lay's", "action": "KEEP", "sales_impact": 2100.0},
            {"sku_id": "SKU-40131", "product_name": "Clover Valley Pretzels 16oz", "brand": "Clover Valley [Private Brand]", "action": "REMOVE", "sales_impact": -320.0},
            {"sku_id": "SKU-40132", "product_name": "Doritos Nacho Cheese 9.75oz", "brand": "Doritos", "action": "KEEP", "sales_impact": 1850.0},
            {"sku_id": "SKU-40133", "product_name": "Clover Valley Tortilla Chips 12oz", "brand": "Clover Valley [Private Brand]", "action": "REMOVE", "sales_impact": -150.0}
        ]
    elif strategy == "Aggressive":
        projected_sales_lift = 10.2
        private_brand_percentage = 31.0
        in_stock_rate = 92.5
        shelf_space_utilized = 95.0
        sku_actions_data = [
            {"sku_id": "SKU-40129", "product_name": "Clover Valley Potato Chips 10oz", "brand": "Clover Valley [Private Brand]", "action": "ADD", "sales_impact": 500.0},
            {"sku_id": "SKU-40130", "product_name": "Lay's Classic 13oz", "brand": "Lay's", "action": "KEEP", "sales_impact": 2100.0},
            {"sku_id": "SKU-40131", "product_name": "Clover Valley Pretzels 16oz", "brand": "Clover Valley [Private Brand]", "action": "SWAP", "sales_impact": 300.0},
            {"sku_id": "SKU-40132", "product_name": "Doritos Nacho Cheese 9.75oz", "brand": "Doritos", "action": "KEEP", "sales_impact": 1850.0},
            {"sku_id": "SKU-40133", "product_name": "Clover Valley Tortilla Chips 12oz", "brand": "Clover Valley [Private Brand]", "action": "KEEP", "sales_impact": 150.0}
        ]
    else:  # Balanced or default
        strategy = "Balanced"
        projected_sales_lift = 5.8
        private_brand_percentage = 26.5
        in_stock_rate = 96.0
        shelf_space_utilized = 88.0
        sku_actions_data = [
            {"sku_id": "SKU-40129", "product_name": "Clover Valley Potato Chips 10oz", "brand": "Clover Valley [Private Brand]", "action": "KEEP", "sales_impact": 1450.0},
            {"sku_id": "SKU-40130", "product_name": "Lay's Classic 13oz", "brand": "Lay's", "action": "KEEP", "sales_impact": 2100.0},
            {"sku_id": "SKU-40131", "product_name": "Clover Valley Pretzels 16oz", "brand": "Clover Valley [Private Brand]", "action": "SWAP", "sales_impact": 100.0},
            {"sku_id": "SKU-40132", "product_name": "Doritos Nacho Cheese 9.75oz", "brand": "Doritos", "action": "KEEP", "sales_impact": 1850.0},
            {"sku_id": "SKU-40133", "product_name": "Clover Valley Tortilla Chips 12oz", "brand": "Clover Valley [Private Brand]", "action": "REMOVE", "sales_impact": -150.0}
        ]

    db_scenario = models.Scenario(
        name=scenario_in.name,
        description=scenario_in.description,
        strategy_type=strategy,
        projected_sales_lift=projected_sales_lift,
        private_brand_percentage=private_brand_percentage,
        in_stock_rate=in_stock_rate,
        shelf_space_utilized=shelf_space_utilized,
        is_submitted=False
    )
    db.add(db_scenario)
    db.commit()
    db.refresh(db_scenario)

    # Add SKU actions
    for action_data in sku_actions_data:
        db_sku = models.ScenarioSKU(
            scenario_id=db_scenario.id,
            sku_id=action_data["sku_id"],
            product_name=action_data["product_name"],
            brand=action_data["brand"],
            action=action_data["action"],
            sales_impact=action_data["sales_impact"]
        )
        db.add(db_sku)
    db.commit()
    db.refresh(db_scenario)
    return db_scenario

def submit_scenario(db: Session, scenario: models.Scenario):
    scenario.is_submitted = True
    scenario.updated_at = datetime.utcnow()
    
    db_audit = models.ApprovalAudit(
        scenario_id=scenario.id,
        submitted_at=datetime.utcnow(),
        submitted_by="Marcus Vance",
        action="SUBMIT",
        status="APPROVED"
    )
    db.add(db_audit)
    db.commit()
    db.refresh(scenario)
    db.refresh(db_audit)
    return db_audit

def get_audits(db: Session):
    return db.query(models.ApprovalAudit).all()
