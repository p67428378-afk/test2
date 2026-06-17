import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from server import models, schemas


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


# --- Product Strategy Decision-Support Tool CRUD ---


def get_products(db: Session):
    # PAGINATION RULE: Every list endpoint MUST accept skip and limit, but here we can just return all or order them.
    # Let's order by name to be deterministic.
    return db.query(models.Product).order_by(models.Product.name).all()


def get_scenarios(db: Session):
    return db.query(models.Scenario).order_by(models.Scenario.name).all()


def get_scenario(db: Session, scenario_id: str):
    return (
        db.query(models.Scenario).filter(models.Scenario.id == str(scenario_id)).first()
    )


def create_approval_request(
    db: Session, request: schemas.ApprovalRequestCreate, scenario: models.Scenario
):
    # Check guardrails
    guardrails = scenario.guardrails
    failed_guardrails = [k for k, v in guardrails.items() if v == "FAIL"]
    if failed_guardrails:
        # Raise error or handle in endpoint. Let's raise ValueError so endpoint can catch it and return 400.
        raise ValueError(f"Guardrail checks failed: {', '.join(failed_guardrails)}")

    # Create ApprovalRequest
    now = datetime.now(timezone.utc)
    db_request = models.ApprovalRequest(
        id=str(uuid.uuid4()),
        scenario_id=scenario.id,
        user_id=request.user_id,
        user_name=request.user_name,
        submission_timestamp=now,
        status="APPROVED",
    )
    db.add(db_request)
    db.flush()  # Get request ID

    # Create AuditTrail
    passed_guardrails = [k for k, v in guardrails.items() if v == "PASS"]
    db_audit = models.AuditTrail(
        id=str(uuid.uuid4()),
        request_id=db_request.id,
        approved_by=request.user_name,
        guardrails_passed=passed_guardrails,
        timestamp=now,
    )
    db.add(db_audit)
    db.commit()
    db.refresh(db_request)
    return db_request


def seed_data(db: Session):
    # Seed Products
    if db.query(models.Product).count() == 0:
        products_data = [
            {
                "name": "Savings Premium",
                "category": "Deposit",
                "aum_contribution": 25.0,
                "npa_percentage": 0.0,
                "status": "GROW",
            },
            {
                "name": "Recurring Deposit Variant X",
                "category": "Deposit",
                "aum_contribution": 10.0,
                "npa_percentage": 0.0,
                "status": "REDUCE",
            },
            {
                "name": "Fixed Deposit Standard",
                "category": "Deposit",
                "aum_contribution": 30.0,
                "npa_percentage": 0.0,
                "status": "MAINTAIN",
            },
            {
                "name": "Personal Loan",
                "category": "Loan",
                "aum_contribution": 15.0,
                "npa_percentage": 4.5,
                "status": "SWAP",
            },
            {
                "name": "Gold Loan",
                "category": "Loan",
                "aum_contribution": 15.0,
                "npa_percentage": 0.75,
                "status": "GROW",
            },
            {
                "name": "Insurance Cross-sell",
                "category": "Cross-sell",
                "aum_contribution": 5.0,
                "npa_percentage": 0.0,
                "status": "GROW",
            },
        ]
        for p in products_data:
            db.add(models.Product(id=str(uuid.uuid4()), **p))
        db.commit()

    # Seed Scenarios
    if db.query(models.Scenario).count() == 0:
        scenarios_data = [
            {
                "id": "11111111-1111-1111-1111-111111111111",
                "name": "Conservative",
                "casa_growth_projection": 2.5,
                "npa_risk_projection": "Low",
                "roa_impact_projection": 0.15,
                "product_actions": [
                    {"action": "Maintain", "product_name": "Savings Premium"},
                    {
                        "action": "Maintain",
                        "product_name": "Recurring Deposit Variant X",
                    },
                    {"action": "Promote", "product_name": "Fixed Deposit Standard"},
                    {"action": "Reduce", "product_name": "Personal Loan"},
                    {"action": "Maintain", "product_name": "Gold Loan"},
                    {"action": "Maintain", "product_name": "Insurance Cross-sell"},
                ],
                "guardrails": {
                    "kyc_aml_flags": "PASS",
                    "minimum_casa_floor": "PASS",
                    "pmla_2002_screening": "PASS",
                    "rbi_exposure_norms": "PASS",
                },
            },
            {
                "id": "22222222-2222-2222-2222-222222222222",
                "name": "Balanced",
                "casa_growth_projection": 5.0,
                "npa_risk_projection": "Moderate",
                "roa_impact_projection": 0.35,
                "product_actions": [
                    {"action": "Promote", "product_name": "Savings Premium"},
                    {"action": "Reduce", "product_name": "Recurring Deposit Variant X"},
                    {"action": "Maintain", "product_name": "Fixed Deposit Standard"},
                    {"action": "Swap", "product_name": "Personal Loan"},
                    {"action": "Promote", "product_name": "Gold Loan"},
                    {"action": "Promote", "product_name": "Insurance Cross-sell"},
                ],
                "guardrails": {
                    "kyc_aml_flags": "PASS",
                    "minimum_casa_floor": "PASS",
                    "pmla_2002_screening": "PASS",
                    "rbi_exposure_norms": "PASS",
                },
            },
            {
                "id": "33333333-3333-3333-3333-333333333333",
                "name": "Aggressive",
                "casa_growth_projection": 8.5,
                "npa_risk_projection": "High",
                "roa_impact_projection": 0.6,
                "product_actions": [
                    {"action": "Promote", "product_name": "Savings Premium"},
                    {
                        "action": "Wind down",
                        "product_name": "Recurring Deposit Variant X",
                    },
                    {"action": "Reduce", "product_name": "Fixed Deposit Standard"},
                    {"action": "Promote", "product_name": "Personal Loan"},
                    {"action": "Promote", "product_name": "Gold Loan"},
                    {"action": "Promote", "product_name": "Insurance Cross-sell"},
                ],
                "guardrails": {
                    "kyc_aml_flags": "PASS",
                    "minimum_casa_floor": "FAIL",
                    "pmla_2002_screening": "PASS",
                    "rbi_exposure_norms": "PASS",
                },
            },
        ]
        for s in scenarios_data:
            db.add(models.Scenario(**s))
        db.commit()
