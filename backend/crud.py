from sqlalchemy.orm import Session
from . import models, schemas

def get_credit_card(db: Session, card_id: str):
    return db.query(models.CreditCard).filter(models.CreditCard.id == card_id).first()

def get_credit_cards(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CreditCard).offset(skip).limit(limit).all()

def create_credit_card(db: Session, card: schemas.CreditCardCreate):
    db_card = models.CreditCard(**card.dict())
    db.add(db_card)
    db.flush()
    db.refresh(db_card)
    return db_card

def get_applicant_by_email(db: Session, email: str):
    return db.query(models.Applicant).filter(models.Applicant.email_address == email).first()

def create_applicant(db: Session, applicant: schemas.ApplicantCreate):
    db_applicant = models.Applicant(**applicant.dict())
    db.add(db_applicant)
    db.flush()
    db.refresh(db_applicant)
    return db_applicant

def create_application_for_applicant(db: Session, application: schemas.ApplicationCreate, applicant_id: str):
    db_application = models.Application(**application.dict(), applicant_id=applicant_id)
    db.add(db_application)
    db.flush()
    db.refresh(db_application)
    return db_application

def get_applications(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Application).offset(skip).limit(limit).all()
