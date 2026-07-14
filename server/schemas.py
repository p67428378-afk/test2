from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID


# Existing Password Reset Schemas
class PasswordResetInitiateRequest(BaseModel):
    login_id: str
    mobile_number: str


class PasswordResetInitiateResponse(BaseModel):
    otp_session_id: str
    security_question: str


class OTPVerifyRequest(BaseModel):
    otp_session_id: str
    otp_code: str


class OTPVerifyResponse(BaseModel):
    security_question_session_id: str


class SecurityQuestionVerifyRequest(BaseModel):
    security_question_session_id: str
    answer: (
        str  # Changed from security_answer to answer to match test_password_reset.py
    )


class SecurityQuestionVerifyResponse(BaseModel):
    password_reset_session_id: str


class SetNewPasswordRequest(BaseModel):
    password_reset_session_id: str
    new_password: str


class SetNewPasswordResponse(BaseModel):
    status: str
    login_link: str


# Subscription Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: UUID
    email: str

    class Config:
        from_attributes = True


class SubscriptionCreate(BaseModel):
    box_size: str = Field(..., description="Small, Medium, or Large")
    frequency_weeks: int = Field(..., description="2, 4, or 6")
    payment_method_token: str


class SubscriptionUpdate(BaseModel):
    status: Optional[str] = None
    skip_next: Optional[bool] = None


class SubscriptionResponse(BaseModel):
    id: UUID
    user_id: UUID
    box_size: str
    frequency_weeks: int
    frequency: Optional[int] = None
    product_id: Optional[str] = None
    status: str
    next_payment_date: datetime
    skip_next: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BillingHistoryItem(BaseModel):
    id: UUID
    amount: float
    payment_date: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True


class SubscriptionMeResponse(BaseModel):
    subscription: Optional[SubscriptionResponse] = None
    billing_history: List[BillingHistoryItem] = []


class SubscriptionUpdateResponse(BaseModel):
    applied_immediately: bool
    message: str
    subscription: SubscriptionResponse


class WebhookPayload(BaseModel):
    subscription_id: UUID
    event_type: str
    amount: float
    status: Optional[str] = None


# Upsell Schemas
class LastOrderResponse(BaseModel):
    id: UUID
    box_size: str
    price: float
    product_id: str


class UpsellEligibilityResponse(BaseModel):
    is_eligible: bool
    last_order: Optional[LastOrderResponse] = None


class DismissResponse(BaseModel):
    status: str
    dismissed_at: datetime
