from sqlalchemy.orm import Session
from server import models, schemas
from datetime import datetime
import uuid

# Password Reset CRUD
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
def get_all_skus(db: Session):
    return db.query(models.SKUPerformance).all()

def get_scenario_by_name(db: Session, name: str):
    return db.query(models.Scenario).filter(models.Scenario.name.ilike(name)).first()

def get_scenario_actions(db: Session, scenario_id: str):
    return db.query(models.ScenarioAction).filter(models.ScenarioAction.scenario_id == scenario_id).all()

def create_assortment_submission(db: Session, user_id: str, scenario_id: str):
    submission_id = f"sub-{uuid.uuid4().hex[:8]}"
    db_sub = models.AssortmentSubmission(
        submission_id=submission_id,
        user_id=user_id,
        scenario_id=scenario_id,
        timestamp=datetime.utcnow()
    )
    db.add(db_sub)
    db.commit()
    db.refresh(db_sub)
    return db_sub

def create_submission_detail(db: Session, submission_id: str, sku_id: str, action_taken: str):
    detail_id = f"det-{uuid.uuid4().hex[:8]}"
    db_detail = models.SubmissionDetails(
        submission_detail_id=detail_id,
        submission_id=submission_id,
        sku_id=sku_id,
        action_taken=action_taken
    )
    db.add(db_detail)
    db.commit()
    db.refresh(db_detail)
    return db_detail

def seed_initial_data(db: Session):
    # Check if SKUs already exist
    if db.query(models.SKUPerformance).count() > 0:
        return

    # Seed SKUs
    skus_data = [
        {"sku_id": "sku-001", "name": "Brand A Potato Chips 10oz", "sales": 15200, "profit_margin": 24.5, "units_sold": 4500, "status_badge": "GROW"},
        {"sku_id": "sku-002", "name": "Brand B Chocolate Cookies 12oz", "sales": 8400, "profit_margin": 18.2, "units_sold": 2100, "status_badge": "REDUCE"},
        {"sku_id": "sku-003", "name": "Clover Valley Tortilla Chips 16oz", "sales": 11200, "profit_margin": 35, "units_sold": 3800, "status_badge": "MAINTAIN"},
        {"sku_id": "sku-004", "name": "Brand C Pretzels 16oz", "sales": 6200, "profit_margin": 15, "units_sold": 1800, "status_badge": "SWAP"}
    ]
    for s in skus_data:
        db_sku = models.SKUPerformance(**s)
        db.add(db_sku)

    # Seed Scenarios
    scenarios_data = [
        {"scenario_id": "scen-001", "name": "Conservative", "description": "Conservative assortment strategy"},
        {"scenario_id": "scen-002", "name": "Balanced", "description": "Balanced assortment strategy"},
        {"scenario_id": "scen-003", "name": "Aggressive", "description": "Aggressive assortment strategy"}
    ]
    for sc in scenarios_data:
        db_sc = models.Scenario(**sc)
        db.add(db_sc)

    db.commit()

    # Seed Scenario Actions
    actions_data = [
        # Balanced
        {"action_id": "act-001", "scenario_id": "scen-002", "sku_id": "sku-001", "action_type": "GROW"},
        {"action_id": "act-002", "scenario_id": "scen-002", "sku_id": "sku-002", "action_type": "REDUCE"},
        {"action_id": "act-003", "scenario_id": "scen-002", "sku_id": "sku-003", "action_type": "MAINTAIN"},
        {"action_id": "act-004", "scenario_id": "scen-002", "sku_id": "sku-004", "action_type": "SWAP"},
        # Conservative
        {"action_id": "act-005", "scenario_id": "scen-001", "sku_id": "sku-001", "action_type": "MAINTAIN"},
        {"action_id": "act-006", "scenario_id": "scen-001", "sku_id": "sku-002", "action_type": "REDUCE"},
        {"action_id": "act-007", "scenario_id": "scen-001", "sku_id": "sku-003", "action_type": "MAINTAIN"},
        {"action_id": "act-008", "scenario_id": "scen-001", "sku_id": "sku-004", "action_type": "REDUCE"},
        # Aggressive
        {"action_id": "act-009", "scenario_id": "scen-003", "sku_id": "sku-001", "action_type": "GROW"},
        {"action_id": "act-010", "scenario_id": "scen-003", "sku_id": "sku-002", "action_type": "SWAP"},
        {"action_id": "act-011", "scenario_id": "scen-003", "sku_id": "sku-003", "action_type": "GROW"},
        {"action_id": "act-012", "scenario_id": "scen-003", "sku_id": "sku-004", "action_type": "GROW"}
    ]
    for act in actions_data:
        db_act = models.ScenarioAction(**act)
        db.add(db_act)

    db.commit()
