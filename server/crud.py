
from sqlalchemy.orm import Session
from server import models, schemas
import uuid

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

# New CRUD operations for Dashboard
def get_aggregated_fiscal_data(db: Session):
    return db.query(models.AggregatedFiscalData).all()

def get_budget_data(db: Session):
    return db.query(models.BudgetData).all()

def create_emergency_fund_transaction(db: Session, project_name: str, amount: float, authorized_by: str):
    db_tx = models.EmergencyFundTransaction(
        project_name=project_name,
        amount=amount,
        authorized_by=authorized_by
    )
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx

def get_emergency_fund_transactions(db: Session):
    return db.query(models.EmergencyFundTransaction).order_by(models.EmergencyFundTransaction.timestamp.desc()).all()

def seed_initial_data(db: Session):
    # Seed budget data if empty
    if db.query(models.BudgetData).count() == 0:
        departments = [
            {"department_name": "Ministry of Defence", "allocated_budget": 200000000, "actual_spending": 212000000, "fiscal_year": 2026},
            {"department_name": "Ministry of Education", "allocated_budget": 250000000, "actual_spending": 245000000, "fiscal_year": 2026},
            {"department_name": "Ministry of Healthcare", "allocated_budget": 300000000, "actual_spending": 290000000, "fiscal_year": 2026},
            {"department_name": "Ministry of Infrastructure", "allocated_budget": 150000000, "actual_spending": 148000000, "fiscal_year": 2026},
            {"department_name": "Ministry of Other", "allocated_budget": 80000000, "actual_spending": 78000000, "fiscal_year": 2026}
        ]
        for dept in departments:
            db_dept = models.BudgetData(**dept)
            db.add(db_dept)
        db.commit()

    # Seed aggregated fiscal data if empty
    if db.query(models.AggregatedFiscalData).count() == 0:
        metrics = [
            {"data_source": "National Bureau of Statistics", "metric_name": "gdp_growth_pct", "metric_value": 2.4},
            {"data_source": "National Bureau of Statistics", "metric_name": "inflation_rate_pct", "metric_value": 3.1},
            {"data_source": "National Bureau of Statistics", "metric_name": "unemployment_rate_pct", "metric_value": 4.2},
            {"data_source": "National Revenue Service", "metric_name": "total_revenue", "metric_value": 1250000000},
            {"data_source": "Department Expense Ledgers", "metric_name": "total_expenditure", "metric_value": 980000000}
        ]
        for metric in metrics:
            db_metric = models.AggregatedFiscalData(**metric)
            db.add(db_metric)
        db.commit()
