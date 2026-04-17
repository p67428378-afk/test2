from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app import schemas
from backend.app.database import get_db
from backend.app.services import kyc_service

router = APIRouter()

@router.post("/", response_model=schemas.kyc.KYCResponse)
def create_kyc(kyc: schemas.kyc.KYCCreate, db: Session = Depends(get_db)):
    db_kyc = kyc_service.create_kyc_record(db=db, kyc=kyc)
    if not db_kyc:
        raise HTTPException(status_code=400, detail="Error creating KYC record")
    processed_kyc = kyc_service.process_kyc(db=db, kyc_id=db_kyc.id)
    return processed_kyc
