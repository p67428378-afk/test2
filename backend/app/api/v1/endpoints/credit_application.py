from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.credit_application import CreditApplication, CreditApplicationCreate, CreditCardTier
from app.services.credit_application_service import credit_application_service
from app.db.session import get_db

router = APIRouter()

@router.post("/applications", response_model=CreditApplication)
def create_credit_application(application: CreditApplicationCreate, db: Session = Depends(get_db)):
    return credit_application_service.create_application(db=db, application=application)

@router.get("/credit-card-tiers", response_model=List[CreditCardTier])
def get_credit_card_tiers(credit_score: int):
    return credit_application_service.get_credit_card_tiers(credit_score=credit_score)

@router.post("/applications/{application_id}/select-tier", response_model=CreditApplication)
def select_credit_card_tier(application_id: int, selected_tier: dict, db: Session = Depends(get_db)):
    db_application = credit_application_service.select_tier(db=db, application_id=application_id, selected_tier=selected_tier.get("selected_credit_card_tier"))
    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_application
