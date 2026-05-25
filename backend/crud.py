
from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date

def get_credit_card_offerings(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CreditCardOffering).offset(skip).limit(limit).all()

def create_credit_card_offering(db: Session, credit_card: schemas.CreditCardOfferingCreate):
    db_credit_card = models.CreditCardOffering(**credit_card.dict())
    db.add(db_credit_card)
    db.commit()
    db.refresh(db_credit_card)
    return db_credit_card

def create_application(db: Session, application: schemas.ApplicationCreate, account_statement_ref: str):
    db_applicant = models.Applicant(**application.applicant.dict())
    db.add(db_applicant)
    db.commit()
    db.refresh(db_applicant)

    db_application = models.Application(
        applicant_id=db_applicant.id,
        credit_card_id=application.credit_card_id,
        submission_date=date.today(),
        last_updated_date=date.today(),
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    db_financial_info = models.FinancialInfo(
        **application.financial_info.dict(),
        application_id=db_application.id,
        account_statement_ref=account_statement_ref
    )
    db.add(db_financial_info)
    db.commit()

    db_employment_info = models.EmploymentInfo(
        **application.employment_info.dict(),
        application_id=db_application.id
    )
    db.add(db_employment_info)
    db.commit()

    db.refresh(db_application)
    return db_application
