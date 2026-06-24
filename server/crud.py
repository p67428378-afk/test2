"""
Module: server.crud
Purpose: CRUD operations for Password Reset and Portfolio Optimizer services.
Author: Backend Developer Agent
Created: 2026-06-24
"""

from sqlalchemy.orm import Session, joinedload
from server import models
from decimal import Decimal

# --- Password Reset CRUD ---


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


# --- Portfolio Optimizer CRUD ---


def get_products(db: Session):
    # Eager load metrics to avoid N+1 queries
    return (
        db.query(models.Product)
        .options(joinedload(models.Product.metrics))
        .order_by(models.Product.name)
        .all()
    )


def get_scenarios(db: Session):
    return db.query(models.Scenario).order_by(models.Scenario.name).all()


def get_scenario_by_id(db: Session, scenario_id: str):
    return db.query(models.Scenario).filter(models.Scenario.id == scenario_id).first()


def create_decision_audit(db: Session, scenario_id: str, approver_name: str):
    db_decision = models.DecisionAudit(
        scenario_id=scenario_id, approver_name=approver_name
    )
    db.add(db_decision)
    # Note: The route handler owns the commit, but we can add it here or let the route handle it.
    # To follow the rule "Services must only call db.add() and return — the route handler owns the commit",
    # we will NOT commit here. We will just add and return.
    return db_decision


def create_guardrail_check(
    db: Session,
    decision_id: str,
    rbi_exposure_norms: str,
    kyc_aml_flags: str,
    pmla_2002_screening: str,
    minimum_casa_floor: str,
):
    db_check = models.GuardrailCheck(
        decision_id=decision_id,
        rbi_exposure_norms=rbi_exposure_norms,
        kyc_aml_flags=kyc_aml_flags,
        pmla_2002_screening=pmla_2002_screening,
        minimum_casa_floor=minimum_casa_floor,
    )
    db.add(db_check)
    return db_check


def seed_portfolio_data(db: Session):
    """Seed initial products, metrics, and scenarios if they don't exist."""
    # Check if products already exist
    if db.query(models.Product).first() is not None:
        return

    # Seed Products and Metrics
    products_data = [
        {"name": "Savings Elite", "aum": 450.0, "npa": 0.0, "status": "GROW"},
        {"name": "RD Regular", "aum": 120.0, "npa": 0.0, "status": "MAINTAIN"},
        {"name": "FD High Yield", "aum": 850.0, "npa": 0.0, "status": "MAINTAIN"},
        {"name": "PL Express", "aum": 65.0, "npa": 4.2, "status": "REDUCE"},
        {"name": "Gold Loan", "aum": 320.0, "npa": 0.8, "status": "GROW"},
        {"name": "Term Insurance", "aum": 15.0, "npa": 0.0, "status": "SWAP"},
    ]

    for p_info in products_data:
        product = models.Product(name=p_info["name"])
        db.add(product)
        db.flush()  # Get product.id

        metric = models.ProductMetric(
            product_id=product.id,
            aum_contribution=Decimal(str(p_info["aum"])),
            npa_percentage=Decimal(str(p_info["npa"])),
            status=p_info["status"],
        )
        db.add(metric)

    # Seed Scenarios
    scenarios_data = [
        {
            "name": "Conservative",
            "casa_growth": "+0.4%",
            "npa_risk_movement": "Low",
            "roa_impact": "+0.1%",
        },
        {
            "name": "Balanced",
            "casa_growth": "+1.2%",
            "npa_risk_movement": "Moderate",
            "roa_impact": "+0.5%",
        },
        {
            "name": "Aggressive",
            "casa_growth": "+2.5%",
            "npa_risk_movement": "High",
            "roa_impact": "+1.1%",
        },
    ]

    for s_info in scenarios_data:
        scenario = models.Scenario(
            name=s_info["name"],
            casa_growth=s_info["casa_growth"],
            npa_risk_movement=s_info["npa_risk_movement"],
            roa_impact=s_info["roa_impact"],
        )
        db.add(scenario)

    db.commit()
