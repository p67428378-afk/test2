
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timedelta
import uuid

from server.app.schemas import password_reset as schemas
from server.app.crud import crud_password_reset as crud
from server.app.services import otp_service, cbs_integration_service, session_invalidation_service
from server.app.core.config import settings
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def initiate_password_reset(db: Session, req: schemas.InitiateResetRequest):
    user = crud.get_user_by_login_id(db, login_id=req.login_id)
    if not user or user.registered_mobile_number != req.mobile_number:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    # Rate limiting and locking logic would be here

    otp_code = otp_service.generate_otp()
    otp_hash = otp_service.get_otp_hash(otp_code)
    expires_at = otp_service.get_otp_expiry()
    crud.create_otp(db, user_id=user.id, otp_hash=otp_hash, expires_at=expires_at)

    # In a real application, you would send the OTP via an SMS gateway
    print(f"Generated OTP for {req.login_id}: {otp_code}")

    return schemas.InitiateResetResponse()

def verify_otp(db: Session, req: schemas.VerifyOTPRequest):
    user = crud.get_user_by_login_id(db, login_id=req.login_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    otp_obj = crud.get_otp(db, user_id=user.id)
    if not otp_obj or not otp_service.verify_otp(req.otp, otp_obj.otp_code_hash):
        # Here you would increment OTP attempt counter and potentially lock the user
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP.")

    crud.mark_otp_as_used(db, db_obj=otp_obj)
    
    security_question = crud.get_user_by_login_id(db, login_id=req.login_id).security_question
    return schemas.VerifyOTPResponse(security_question=security_question)

def verify_security_question(db: Session, req: schemas.VerifySecurityQuestionRequest):
    user = crud.get_user_by_login_id(db, login_id=req.login_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if not pwd_context.verify(req.answer, user.security_answer_hash):
        # Here you would increment security question attempt counter and potentially lock the user
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect answer.")

    # Generate a short-lived reset token
    reset_token = str(uuid.uuid4())
    token_expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    attempt = crud.get_password_reset_attempt(db, user_id=user.id)
    if not attempt:
        attempt = crud.create_password_reset_attempt(db, user_id=user.id)

    crud.update_password_reset_attempt(db, db_obj=attempt, obj_in={"reset_token": reset_token, "token_expires_at": token_expires_at, "status": "VERIFIED"})

    return schemas.VerifySecurityQuestionResponse(reset_token=reset_token)

async def set_new_password(db: Session, req: schemas.SetPasswordRequest):
    user = crud.get_user_by_login_id(db, login_id=req.login_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    attempt = crud.get_password_reset_attempt(db, user_id=user.id)
    if not attempt or attempt.reset_token != req.reset_token or attempt.token_expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired reset token.")

    # Password complexity checks
    if len(req.new_password) < settings.PASSWORD_MIN_LENGTH:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password is too short.")
    if pwd_context.verify(req.new_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New password cannot be the same as the old one.")

    new_password_hash = pwd_context.hash(req.new_password)
    crud.update_user_password(db, user=user, password_hash=new_password_hash)

    # Invalidate sessions
    await session_invalidation_service.invalidate_user_sessions(user.login_id)

    # Clean up reset attempt
    crud.update_password_reset_attempt(db, db_obj=attempt, obj_in={"status": "COMPLETED", "reset_token": None})

    return schemas.SetPasswordResponse(login_link="/login")
