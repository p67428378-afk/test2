from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Existing Password Reset Schemas
class PasswordResetInitiateRequest(BaseModel):
    login_id: str
    mobile_number: str

class PasswordResetInitiateResponse(BaseModel):
    otp_session_id: str
    security_question: str

class OTPVerifyRequest(BaseModel):
    otp_code: str
    otp_session_id: str

class OTPVerifyResponse(BaseModel):
    security_question_session_id: str

class SecurityQuestionVerifyRequest(BaseModel):
    answer: str
    security_question_session_id: str

class SecurityQuestionVerifyResponse(BaseModel):
    password_reset_session_id: str

class SetNewPasswordRequest(BaseModel):
    new_password: str
    password_reset_session_id: str

class SetNewPasswordResponse(BaseModel):
    status: str
    login_link: str

# New Mobile Number Update Schemas
class MobileUpdateInitiateRequest(BaseModel):
    account_number: str
    new_mobile_number: str

class MobileUpdateInitiateResponse(BaseModel):
    message: str
    request_id: str
    status: str

class VerifyOldOTPRequest(BaseModel):
    otp: str
    request_id: str

class VerifyOldOTPResponse(BaseModel):
    message: str
    request_id: str
    status: str

class VerifyNewOTPRequest(BaseModel):
    otp: str
    request_id: str

class VerifyNewOTPResponse(BaseModel):
    message: str
    request_id: str
    status: str

class MobileUpdateStatusResponse(BaseModel):
    account_number: str
    created_at: datetime
    request_id: str
    status: str
    updated_at: datetime

    class Config:
        from_attributes = True
