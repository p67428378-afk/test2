from sqlalchemy.orm import Session
from server import models, schemas
from datetime import datetime, date
from uuid import UUID
from typing import Optional, List

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


# New KYC & AML CRUD
def get_customer_by_email(db: Session, email: str):
    return db.query(models.Customer).filter(models.Customer.email == email).first()

def get_customer_by_phone(db: Session, phone: str):
    return db.query(models.Customer).filter(models.Customer.phone == phone).first()

def create_customer(db: Session, customer_in: schemas.CustomerCreate):
    dob = datetime.strptime(customer_in.dateOfBirth, "%Y-%m-%d").date()
    db_customer = models.Customer(
        first_name=customer_in.firstName,
        last_name=customer_in.lastName,
        email=customer_in.email,
        phone=customer_in.phone,
        date_of_birth=dob,
        address=customer_in.address,
        aadhaar_number=customer_in.aadhaarNumber,
        pan_number=customer_in.panNumber,
        status="REVIEW",
        risk_score=0.0
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def get_customers(db: Session, skip: int = 0, limit: int = 10, status: Optional[str] = None):
    query = db.query(models.Customer)
    if status:
        query = query.filter(models.Customer.status == status)
    return query.offset(skip).limit(limit).all()

def get_customer_by_id(db: Session, customer_id: UUID):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def create_verification_check(db: Session, customer_id: UUID, check_type: str, status: str, details: Optional[str] = None):
    db_check = models.VerificationCheck(
        customer_id=customer_id,
        check_type=check_type,
        status=status,
        details=details
    )
    db.add(db_check)
    db.commit()
    db.refresh(db_check)
    return db_check

def get_verification_checks_by_customer_id(db: Session, customer_id: UUID):
    return db.query(models.VerificationCheck).filter(models.VerificationCheck.customer_id == customer_id).all()

def create_screening_result(db: Session, customer_id: UUID, watchlist: str, match_status: str, confidence_score: float, reason: Optional[str] = None):
    db_result = models.ScreeningResult(
        customer_id=customer_id,
        watchlist=watchlist,
        match_status=match_status,
        confidence_score=confidence_score,
        reason=reason
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

def get_screening_results_by_customer_id(db: Session, customer_id: UUID):
    return db.query(models.ScreeningResult).filter(models.ScreeningResult.customer_id == customer_id).all()

def update_customer_status_and_risk(db: Session, customer_id: UUID, status: str, risk_score: float):
    customer = get_customer_by_id(db, customer_id)
    if customer:
        customer.status = status
        customer.risk_score = risk_score
        customer.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(customer)
    return customer

def create_transaction(db: Session, customer_id: UUID, amount: float, transaction_type: str, destination_account: Optional[str] = None):
    db_transaction = models.Transaction(
        customer_id=customer_id,
        amount=amount,
        transaction_type=transaction_type,
        destination_account=destination_account,
        status="COMPLETED"
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_alerts(db: Session, skip: int = 0, limit: int = 10, status: Optional[str] = None):
    query = db.query(models.Alert)
    if status:
        query = query.filter(models.Alert.status == status)
    return query.offset(skip).limit(limit).all()

def create_alert(db: Session, customer_id: UUID, triggered_rule: str, total_amount: float, severity: str, status: str = "OPEN", notes: Optional[str] = None):
    db_alert = models.Alert(
        customer_id=customer_id,
        triggered_rule=triggered_rule,
        total_amount=total_amount,
        severity=severity,
        status=status,
        notes=notes
    )
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

def get_reports(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Report).offset(skip).limit(limit).all()

def create_report(db: Session, customer_id: Optional[UUID], report_type: str, xml_content: str, status: str = "PENDING"):
    db_report = models.Report(
        customer_id=customer_id,
        report_type=report_type,
        xml_content=xml_content,
        status=status
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def get_report_by_id(db: Session, report_id: UUID):
    return db.query(models.Report).filter(models.Report.id == report_id).first()

def update_report_status(db: Session, report_id: UUID, status: str):
    report = get_report_by_id(db, report_id)
    if report:
        report.status = status
        report.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(report)
    return report

def create_audit_log(db: Session, customer_id: Optional[UUID], action: str, performed_by: str, details: Optional[str] = None):
    db_log = models.AuditLog(
        customer_id=customer_id,
        action=action,
        performed_by=performed_by,
        details=details
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
