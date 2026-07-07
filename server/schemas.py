from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional


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


# Transaction schemas for SCRUM-474
class TransactionVerifyResponse(BaseModel):
    id: UUID
    amount: float
    merchant_name: str
    status: str
    expires_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class TransactionActionRequest(BaseModel):
    action: str = Field(..., description="Must be 'approve' or 'block'")
    token: str = Field(..., description="Secure single-use JWT token")


class TransactionActionResponse(BaseModel):
    id: UUID
    status: str
    updated_at: datetime
    card_status: Optional[str] = None
    message: Optional[str] = None
    transaction_id: Optional[UUID] = None
    wallet_token: Optional[str] = None

    class Config:
        from_attributes = True
