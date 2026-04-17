from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.kyc import KYCCreate, KYCSchema
from app.services.kyc_service import KYCService
from app.db.database import get_db

router = APIRouter()

@router.post("/kyc", response_model=KYCSchema)
def create_kyc_record(kyc: KYCCreate, db: Session = Depends(get_db)):
    kyc_service = KYCService(db)
    db_kyc = kyc_service.create_kyc_record(kyc=kyc)
    return db_kyc
