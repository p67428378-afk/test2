from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import date

from backend import models, schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# User Services
def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Applicant Services
def get_applicant(db: Session, applicant_id: str):
    return db.query(models.Applicant).filter(models.Applicant.id == applicant_id).first()

def get_applicants(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Applicant).offset(skip).limit(limit).all()

def create_applicant(db: Session, applicant: schemas.ApplicantCreate):
    db_applicant = models.Applicant(**applicant.model_dump())
    db.add(db_applicant)
    db.commit()
    db.refresh(db_applicant)
    return db_applicant

def update_applicant(db: Session, applicant_id: str, applicant_update: schemas.ApplicantUpdate):
    db_applicant = db.query(models.Applicant).filter(models.Applicant.id == applicant_id).first()
    if db_applicant:
        for key, value in applicant_update.model_dump(exclude_unset=True).items():
            setattr(db_applicant, key, value)
        db.commit()
        db.refresh(db_applicant)
    return db_applicant

# Credit Card Services
def get_credit_card(db: Session, card_id: str):
    return db.query(models.CreditCard).filter(models.CreditCard.id == card_id).first()

def get_credit_cards(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CreditCard).offset(skip).limit(limit).all()

def create_credit_card(db: Session, card: schemas.CreditCardCreate):
    db_card = models.CreditCard(**card.model_dump())
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

# Application Services
def get_application(db: Session, application_id: str):
    return db.query(models.Application).filter(models.Application.id == application_id).first()

def get_applications(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Application).offset(skip).limit(limit).all()

def create_application(db: Session, application: schemas.ApplicationCreate):
    db_application = models.Application(
        **application.model_dump(),
        status="Pending",
        submission_date=date.today(),
        last_updated_date=date.today()
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def update_application(db: Session, application_id: str, application_update: schemas.ApplicationUpdate):
    db_application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if db_application:
        for key, value in application_update.model_dump(exclude_unset=True).items():
            setattr(db_application, key, value)
        db_application.last_updated_date = date.today()
        db.commit()
        db.refresh(db_application)
    return db_application
