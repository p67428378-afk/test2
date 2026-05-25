from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas import schemas
from backend.services import mobile_update_service

router = APIRouter(
    prefix="/mobile-update",
    tags=["mobile-update"],
)

@router.post("/initiate", response_model=schemas.MobileNumberUpdateResponse)
def initiate_mobile_number_update(request: schemas.MobileNumberUpdateRequest, db: Session = Depends(get_db)):
    return mobile_update_service.initiate_update(db, request.customer_id, request.new_mobile_number)

@router.post("/verify-old-otp", response_model=schemas.MobileNumberUpdateResponse)
def verify_old_otp(request: schemas.OTPVerify, db: Session = Depends(get_db)):
    return mobile_update_service.verify_old_otp(db, request.customer_id, request.otp)

@router.post("/verify-new-otp", response_model=schemas.MobileNumberUpdateResponse)
def verify_new_otp(request: schemas.OTPVerifyNew, db: Session = Depends(get_db)):
    return mobile_update_service.verify_new_otp_and_update(db, request.customer_id, request.otp, request.new_mobile_number)
