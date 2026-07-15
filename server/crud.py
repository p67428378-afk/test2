from sqlalchemy.orm import Session
from server import models
from uuid import UUID


# Existing CRUD functions for password reset
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_user(db: Session, user: models.User):
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_otp(db: Session, otp: models.OTP):
    db.add(otp)
    db.commit()
    db.refresh(otp)
    return otp


def get_latest_otp_by_user_id(db: Session, user_id: UUID):
    return (
        db.query(models.OTP)
        .filter(models.OTP.user_id == user_id)
        .order_by(models.OTP.created_at.desc())
        .first()
    )


def update_otp(db: Session, otp: models.OTP):
    db.commit()
    db.refresh(otp)
    return otp


def create_password_history(db: Session, history: models.PasswordHistory):
    db.add(history)
    db.commit()
    db.refresh(history)
    return history


def get_password_history_by_user_id(db: Session, user_id: UUID):
    return (
        db.query(models.PasswordHistory)
        .filter(models.PasswordHistory.user_id == user_id)
        .all()
    )


def update_user_password(db: Session, user: models.User):
    db.commit()
    db.refresh(user)
    return user


# New CRUD functions for DG Cluster Assortment Advisor
def get_all_skus_with_performance_and_scenarios(db: Session, category: str = "snacks"):
    # Query SKUs and join performance and scenarios
    skus = db.query(models.SKU).filter(models.SKU.category == category).all()
    results = []
    for sku in skus:
        # Get latest performance
        perf = (
            db.query(models.SKUPerformance)
            .filter(models.SKUPerformance.sku_id == sku.id)
            .order_by(models.SKUPerformance.created_at.desc())
            .first()
        )
        # Get scenarios
        scenarios = (
            db.query(models.AssortmentScenario)
            .filter(models.AssortmentScenario.sku_id == sku.id)
            .all()
        )

        scenario_dict = {}
        for s in scenarios:
            scenario_dict[s.scenario_name] = {"action": s.action}

        # Ensure all three scenarios exist in response
        for name in ["Conservative", "Balanced", "Aggressive"]:
            if name not in scenario_dict:
                scenario_dict[name] = {"action": "MAINTAIN"}

        results.append(
            {
                "sku_id": sku.id,
                "sku_number": sku.sku_number,
                "product_name": sku.product_name,
                "is_private_brand": sku.is_private_brand,
                "sales": float(perf.sales) if perf else 0.0,
                "units": perf.units if perf else 0,
                "margin_percentage": float(perf.margin_percentage) if perf else 0.0,
                "scenarios": scenario_dict,
            }
        )
    return results


def create_submission_log(
    db: Session, user_id: str, scenario_selected: str, actions_payload: dict
):
    db_sub = models.SubmissionLog(
        user_id=user_id,
        scenario_selected=scenario_selected,
        actions_payload=actions_payload,
    )
    db.add(db_sub)
    db.commit()
    db.refresh(db_sub)
    return db_sub
