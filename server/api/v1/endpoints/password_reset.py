from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import schemas, crud
from server.database import get_db

router = APIRouter()

@router.post("/password-reset/initiate", response_model=schemas.PasswordResetInitiateResponse)
def initiate_password_reset(request: schemas.PasswordResetInitiateRequest, db: Session = Depends(get_db)):
    return schemas.PasswordResetInitiateResponse(otp_session_id="dummy_otp_session_id", security_question="dummy_security_question")

@router.post("/password-reset/verify-otp", response_model=schemas.OTPVerifyResponse)
def verify_otp(request: schemas.OTPVerifyRequest, db: Session = Depends(get_db)):
    return schemas.OTPVerifyResponse(security_question_session_id="dummy_sq_session_id")

@router.post("/password-reset/verify-security-question", response_model=schemas.SecurityQuestionVerifyResponse)
def verify_security_question(request: schemas.SecurityQuestionVerifyRequest, db: Session = Depends(get_db)):
    return schemas.SecurityQuestionVerifyResponse(password_reset_session_id="dummy_pr_session_id")

@router.post("/password-reset/set-new-password", response_model=schemas.SetNewPasswordResponse)
def set_new_password(request: schemas.SetNewPasswordRequest, db: Session = Depends(get_db)):
    return schemas.SetNewPasswordResponse(status="RESET SUCCESSFUL", login_link="/login")
