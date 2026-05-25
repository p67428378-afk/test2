from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.kyc import KYCCreate, KYCResponse, AuditLogResponse
from app.services import kyc_service
import uuid
from typing import List

router = APIRouter()

@router.post("/kyc/", response_model=KYCResponse)
def create_kyc(kyc_in: KYCCreate, db: Session = Depends(get_db)):
    # In a real app, initiator would come from auth token
    return kyc_service.create_kyc_record(db=db, kyc_in=kyc_in, initiator="user@example.com")

@router.get("/kyc/{kyc_id}/status", response_model=KYCResponse)
def get_kyc_status(kyc_id: uuid.UUID, db: Session = Depends(get_db)):
    db_kyc = kyc_service.get_kyc_status(db, kyc_id=kyc_id)
    if db_kyc is None:
        raise HTTPException(status_code=404, detail="KYC record not found")
    return db_kyc

@router.get("/kyc/{kyc_id}/audit", response_model=List[AuditLogResponse])
def get_audit_trail(kyc_id: uuid.UUID, db: Session = Depends(get_db)):
    audit_trail = kyc_service.get_audit_trail(db, kyc_id=kyc_id)
    if not audit_trail:
        raise HTTPException(status_code=404, detail="Audit trail not found for this KYC record")
    return audit_trail
