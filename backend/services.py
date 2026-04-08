from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date

def create_applicant(db: Session, applicant: schemas.ApplicantCreate):
    db_applicant = models.Applicant(**applicant.model_dump())
    db.add(db_applicant)
    db.commit()
    db.refresh(db_applicant)
    return db_applicant

def get_applicant_by_user_id(db: Session, user_id: str):
    return db.query(models.Applicant).filter(models.Applicant.user_id == user_id).first()

def get_applicant_by_applicant_id(db: Session, applicant_id: str):
    return db.query(models.Applicant).filter(models.Applicant.applicant_id == applicant_id).first()

def create_application(db: Session, application: schemas.ApplicationCreate):
    db_application = models.Application(**application.model_dump(), submission_date=date.today(), last_updated=date.today())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def get_application(db: Session, application_id: str):
    return db.query(models.Application).filter(models.Application.application_id == application_id).first()

def update_application_status(db: Session, application_id: str, status: str):
    db_application = db.query(models.Application).filter(models.Application.application_id == application_id).first()
    if db_application:
        db_application.status = status
        db_application.last_updated = date.today()
        db.commit()
        db.refresh(db_application)
    return db_application

def create_financial_info(db: Session, financial_info: schemas.FinancialInfoCreate, application_id: str):
    db_financial_info = models.FinancialInfo(**financial_info.model_dump(), application_id=application_id)
    db.add(db_financial_info)
    db.commit()
    db.refresh(db_financial_info)
    return db_financial_info

def create_employment_info(db: Session, employment_info: schemas.EmploymentInfoCreate, application_id: str):
    db_employment_info = models.EmploymentInfo(**employment_info.model_dump(), application_id=application_id)
    db.add(db_employment_info)
    db.commit()
    db.refresh(db_employment_info)
    return db_employment_info
