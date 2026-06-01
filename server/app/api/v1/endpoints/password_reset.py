
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from server.app.schemas import password_reset as schemas
from server.app.services import password_reset_service
from server.app.db.session import get_db

router = APIRouter()

@router.post("/initiate", response_model=schemas.InitiateResetResponse)
def initiate_password_reset(req: schemas.InitiateResetRequest, db: Session = Depends(get_db)):
    return password_reset_service.initiate_password_reset(db, req)

@router.post("/verify-otp", response_model=schemas.VerifyOTPResponse)
def verify_otp(req: schemas.VerifyOTPRequest, db: Session = Depends(get_db)):
    return password_reset_service.verify_otp(db, req)

@router.post("/verify-security-question", response_model=schemas.VerifySecurityQuestionResponse)
def verify_security_question(req: schemas.VerifySecurityQuestionRequest, db: Session = Depends(get_db)):
    return password_reset_service.verify_security_question(db, req)

@router.post("/set-password", response_model=schemas.SetPasswordResponse)
async def set_new_password(req: schemas.SetPasswordRequest, db: Session = Depends(get_db)):
    return await password_reset_service.set_new_password(db, req)
