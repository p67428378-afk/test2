from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# Existing schemas for password reset compatibility
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


# New schemas for SCRUM-473


class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone_number: str = Field(..., min_length=5, max_length=50)
    date_of_birth: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    ssn: str = Field(..., min_length=9, max_length=11)
    password: str = Field(..., min_length=8)


class UserRegisterResponse(BaseModel):
    id: str
    full_name: str
    email: str
    is_active: bool
    created_at: str


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserLoginResponse(BaseModel):
    requires_2fa: bool
    temp_token: Optional[str] = None
    user_id: str


class User2FASetupRequest(BaseModel):
    user_id: str
    method_type: str  # 'SMS' or 'APP'


class User2FASetupResponse(BaseModel):
    secret: str
    qr_code_uri: Optional[str] = None


class User2FAVerifyRequest(BaseModel):
    user_id: str
    temp_token: str
    code: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
