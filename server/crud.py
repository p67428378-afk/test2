from sqlalchemy.orm import Session, joinedload
from server import models
import uuid
from datetime import datetime, timezone


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


# --- New CRUD Operations for Retail Banking Product Decision-Support Dashboard ---


def get_products(db: Session):
    return db.query(models.Product).order_by(models.Product.name).all()


def get_scenarios(db: Session):
    return (
        db.query(models.Scenario)
        .options(
            joinedload(models.Scenario.product_actions).joinedload(
                models.ScenarioProductAction.product
            )
        )
        .all()
    )


def get_scenario_by_id(db: Session, scenario_id: str):
    return db.query(models.Scenario).filter(models.Scenario.id == scenario_id).first()


def create_proposal(
    db: Session,
    scenario_id: str,
    submitted_by: str,
    routed_to: str,
    guardrails_passed: bool,
    audit_trail: str,
):
    db_proposal = models.Proposal(
        id=str(uuid.uuid4()),
        scenario_id=scenario_id,
        status="SUBMITTED",
        submitted_by=submitted_by,
        routed_to=routed_to,
        timestamp=datetime.now(timezone.utc),
        guardrails_passed=guardrails_passed,
        audit_trail=audit_trail,
    )
    db.add(db_proposal)
    # Note: The route handler owns the commit, but we can commit here or in the route.
    # Wait, the backend-development-skill says:
    # "NEVER call db.commit() inside a service/helper function (e.g. AuditService.log_action). Services must only call db.add() and return — the route handler owns the commit."
    # So we will NOT call db.commit() here. We will just call db.add() and return the object.
    return db_proposal


def seed_initial_data(db: Session):
    # Check if products already exist
    if db.query(models.Product).first() is not None:
        return

    # Seed Products
    products_data = [
        {
            "name": "Savings Max",
            "category": "Savings",
            "aum_contribution": 120.0,
            "npa_percentage": None,
            "status": "MAINTAIN",
        },
        {
            "name": "Rural Agri-Saver",
            "category": "Savings",
            "aum_contribution": 85.0,
            "npa_percentage": None,
            "status": "GROW",
        },
        {
            "name": "Regular RD",
            "category": "RD",
            "aum_contribution": 45.0,
            "npa_percentage": None,
            "status": "GROW",
        },
        {
            "name": "Premium FD",
            "category": "FD",
            "aum_contribution": 160.0,
            "npa_percentage": None,
            "status": "REDUCE",
        },
        {
            "name": "Gold Loan",
            "category": "Agri-backed",
            "aum_contribution": 95.0,
            "npa_percentage": 1.1,
            "status": "GROW",
        },
        {
            "name": "Personal Loan",
            "category": "Rural",
            "aum_contribution": 35.0,
            "npa_percentage": 4.8,
            "status": "SWAP",
        },
        {
            "name": "Crop Insurance",
            "category": "Cross-Sell",
            "aum_contribution": 12.0,
            "npa_percentage": None,
            "status": "GROW",
        },
    ]

    db_products = {}
    for p in products_data:
        prod = models.Product(
            id=str(uuid.uuid4()),
            name=p["name"],
            category=p["category"],
            aum_contribution=p["aum_contribution"],
            npa_percentage=p["npa_percentage"],
            status=p["status"],
        )
        db.add(prod)
        db_products[p["name"]] = prod

    # Seed Scenarios
    scenarios_data = [
        {
            "id": "conservative",
            "name": "Conservative",
            "description": "Focus on risk mitigation and maintaining high CASA floor.",
            "casa_growth": 1.5,
            "npa_risk": "Low",
            "roa_impact": 0.25,
            "actions": {
                "Savings Max": "MAINTAIN",
                "Rural Agri-Saver": "GROW",
                "Regular RD": "MAINTAIN",
                "Premium FD": "REDUCE",
                "Gold Loan": "MAINTAIN",
                "Personal Loan": "REDUCE",
                "Crop Insurance": "GROW",
            },
        },
        {
            "id": "balanced",
            "name": "Balanced",
            "description": "Promote Rural Agri-Saver & Gold Loans; Reduce Premium FD; Swap Personal Loans to low-risk variants.",
            "casa_growth": 3.2,
            "npa_risk": "Medium",
            "roa_impact": 0.65,
            "actions": {
                "Savings Max": "MAINTAIN",
                "Rural Agri-Saver": "GROW",
                "Regular RD": "GROW",
                "Premium FD": "REDUCE",
                "Gold Loan": "GROW",
                "Personal Loan": "SWAP",
                "Crop Insurance": "GROW",
            },
        },
        {
            "id": "aggressive",
            "name": "Aggressive",
            "description": "Maximize loan growth and cross-sell targets across all branches.",
            "casa_growth": 5.0,
            "npa_risk": "High",
            "roa_impact": 1.10,
            "actions": {
                "Savings Max": "GROW",
                "Rural Agri-Saver": "GROW",
                "Regular RD": "GROW",
                "Premium FD": "MAINTAIN",
                "Gold Loan": "GROW",
                "Personal Loan": "GROW",
                "Crop Insurance": "GROW",
            },
        },
    ]

    for s in scenarios_data:
        scen = models.Scenario(
            id=s["id"],
            name=s["name"],
            description=s["description"],
            casa_growth=s["casa_growth"],
            npa_risk=s["npa_risk"],
            roa_impact=s["roa_impact"],
        )
        db.add(scen)

        # Seed Scenario Product Actions
        for prod_name, action in s["actions"].items():
            prod = db_products.get(prod_name)
            if prod:
                act = models.ScenarioProductAction(
                    id=str(uuid.uuid4()),
                    scenario_id=s["id"],
                    product_id=prod.id,
                    action=action,
                )
                db.add(act)

    db.commit()
