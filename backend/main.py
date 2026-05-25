from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/api/offers/", response_model=schemas.CreditCardOffer)
def create_credit_card_offer(offer: schemas.CreditCardOfferCreate, db: Session = Depends(get_db)):
    db_offer = models.CreditCardOffer(**offer.dict())
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)
    return db_offer

@app.get("/api/offers/", response_model=List[schemas.CreditCardOffer])
def get_credit_card_offers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    offers = db.query(models.CreditCardOffer).offset(skip).limit(limit).all()
    return offers

@app.post("/api/applications/", response_model=schemas.Application)
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    applicant_data = application.applicant
    employment_data = applicant_data.employment

    db_applicant = models.Applicant(**applicant_data.dict(exclude={"employment"}))
    db.add(db_applicant)
    db.commit()
    db.refresh(db_applicant)

    db_employment = models.Employment(**employment_data.dict(), applicant_id=db_applicant.id)
    db.add(db_employment)
    db.commit()
    db.refresh(db_employment)

    db_application = models.Application(
        submission_date=application.submission_date,
        status=application.status,
        applicant_id=db_applicant.id,
        offer_id=application.offer_id
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

@app.get("/api/applications/", response_model=List[schemas.Application])
def get_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    applications = db.query(models.Application).offset(skip).limit(limit).all()
    return applications
