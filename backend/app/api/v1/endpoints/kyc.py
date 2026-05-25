
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.customer import Customer, CustomerCreate
from app.db import session
from app.services.kyc_service import kyc_service

router = APIRouter()

def get_db():
    db = session.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/onboard", response_model=Customer)
def onboard_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    return kyc_service.onboard_customer(db=db, customer=customer)
