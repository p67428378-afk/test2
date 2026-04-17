from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import schemas
from app.database import get_db
from app.services.kyc_service import kyc_service

router = APIRouter()


@router.post("/kyc", response_model=schemas.kyc.KycResponse)
def create_kyc_request(kyc_request: schemas.kyc.KycRequest, db: Session = Depends(get_db)):
    return kyc_service.process_kyc(db=db, kyc_request=kyc_request)
