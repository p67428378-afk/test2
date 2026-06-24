from sqlalchemy.orm import Session
from server import models, schemas
import uuid


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
    otp.is_used = True  # type: ignore
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
    user.hashed_password = hashed_password  # type: ignore
    db.commit()
    db.refresh(user)
    return user


# --- DG Cluster Assortment Advisor CRUD ---


def get_products_with_metrics(db: Session):
    return db.query(models.Product).all()


def get_scenarios(db: Session):
    return db.query(models.Scenario).all()


def get_scenario_by_name(db: Session, name: str):
    return db.query(models.Scenario).filter(models.Scenario.name == name).first()


def create_assortment_submission(
    db: Session, submission: schemas.AssortmentSubmitRequest, submitted_by: str
):
    db_submission = models.AssortmentSubmission(
        scenario_name=submission.scenario_name,
        submitted_by=submitted_by,
        submission_data=[action.dict() for action in submission.sku_actions],
        audit_trail_id=uuid.uuid4(),
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission
