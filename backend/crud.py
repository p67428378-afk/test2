from sqlalchemy.orm import Session
from . import models, schemas

def get_user_by_username(db: Session, username: str):
    return db.query(models.BankRepresentative).filter(models.BankRepresentative.username == username).first()

def get_loan_applications(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.LoanApplication).offset(skip).limit(limit).all()

def get_loan_application(db: Session, application_id: str):
    return db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()

def update_loan_application_status(db: Session, application_id: str, status: str):
    db_loan_application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if db_loan_application:
        db_loan_application.status = status
        db.commit()
        db.refresh(db_loan_application)
    return db_loan_application
