from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID


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


# Notification Schemas
class TransactionResponseRequest(BaseModel):
    decision: str = Field(..., description="APPROVE or BLOCK")
    notification_id: UUID
    transaction_id: str


class TransactionResponseResponse(BaseModel):
    message: str
    status: str


class NotificationItem(BaseModel):
    id: UUID
    transaction_id: str
    user_id: UUID
    amount: float
    merchant: str
    status: str
    decision: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationListResponse(BaseModel):
    items: List[NotificationItem]
    total: int
