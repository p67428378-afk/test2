from sqlalchemy.orm import Session
from .. import models, schemas
from typing import List, Optional

def get_application(db: Session, application_id: str):
    return db.query(models.CreditCardApplication).filter(models.CreditCardApplication.application_id == application_id).first()

def get_applications_by_user(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.CreditCardApplication).filter(models.CreditCardApplication.user_id == user_id).offset(skip).limit(limit).all()

def create_applicant(db: Session, applicant: schemas.ApplicantCreate):
    db_applicant = models.Applicant(
        first_name=applicant.first_name,
        last_name=applicant.last_name,
        email=applicant.email,
        phone_number=applicant.phone_number,
        address=applicant.address.model_dump(),
        authentication_credentials=applicant.authentication_credentials
    )
    db.add(db_applicant)
    db.commit()
    db.refresh(db_applicant)
    return db_applicant

def get_applicant_by_email(db: Session, email: str):
    return db.query(models.Applicant).filter(models.Applicant.email == email).first()

def create_application(db: Session, application: schemas.CreditCardApplicationCreate):
    # Check if applicant exists, if not, create one (simplified for now)
    # In a real app, applicant creation would be part of user registration
    db_application = models.CreditCardApplication(
        user_id=application.user_id,
        product_id=application.product_id,
        personal_info=application.personal_info.model_dump(),
        financial_info=application.financial_info.model_dump(),
        status=application.status,
        comments=application.comments
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def update_application_status(db: Session, application_id: str, status_update: schemas.CreditCardApplicationUpdate):
    db_application = db.query(models.CreditCardApplication).filter(models.CreditCardApplication.application_id == application_id).first()
    if db_application:
        if status_update.status:
            db_application.status = status_update.status
        if status_update.comments:
            db_application.comments = status_update.comments
        db.commit()
        db.refresh(db_application)
    return db_application
