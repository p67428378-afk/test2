"""
Module: server/crud.py
Purpose: CRUD operations for Global Treasury Sweeping Rule Management
"""

from sqlalchemy.orm import Session
from server import models, schemas


# Existing Password Reset CRUD
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


# New Sweeping Rule CRUD
def get_sweep_rules(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(models.SweepRule)
        .order_by(models.SweepRule.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_sweep_rule(db: Session, rule_id: str):
    return db.query(models.SweepRule).filter(models.SweepRule.id == rule_id).first()


def create_sweep_rule(db: Session, rule: schemas.SweepRuleCreate, user_id: str):
    db_rule = models.SweepRule(
        user_id=user_id,
        name=rule.name,
        source_accounts=rule.source_accounts,
        target_account=rule.target_account,
        threshold=rule.threshold,
        frequency=rule.frequency,
        fx_strategy=rule.fx_strategy,
        status="PENDING_APPROVAL",
    )
    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)
    return db_rule


def update_sweep_rule(
    db: Session, db_rule: models.SweepRule, rule_update: schemas.SweepRuleUpdate
):
    db_rule.name = rule_update.name  # type: ignore
    db_rule.source_accounts = rule_update.source_accounts  # type: ignore
    db_rule.target_account = rule_update.target_account  # type: ignore
    db_rule.threshold = rule_update.threshold  # type: ignore
    db_rule.frequency = rule_update.frequency  # type: ignore
    db_rule.fx_strategy = rule_update.fx_strategy  # type: ignore
    db.commit()
    db.refresh(db_rule)
    return db_rule


def get_account_by_number(db: Session, account_number: str):
    return (
        db.query(models.Account)
        .filter(models.Account.account_number == account_number)
        .first()
    )


def create_sweep_execution(db: Session, execution_data: dict):
    db_execution = models.SweepExecution(**execution_data)
    db.add(db_execution)
    db.commit()
    db.refresh(db_execution)
    return db_execution


def create_notification_log(db: Session, log_data: dict):
    db_log = models.NotificationLog(**log_data)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
