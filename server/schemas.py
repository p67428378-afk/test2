from pydantic import BaseModel, Field
from typing import Optional
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


# Payment Schemas
class PaymentTokenCreate(BaseModel):
    payment_token: str = Field(..., description="Secure token from payment gateway")
    card_last_four: str = Field(
        ..., min_length=4, max_length=4, description="Last 4 digits of the card"
    )
    card_brand: str = Field(..., description="Card brand (e.g., Visa, Mastercard)")
    card_expiry_date: str = Field(
        ..., description="Card expiry date in YYYY-MM-DD format"
    )


class PaymentTokenResponse(BaseModel):
    id: UUID
    user_id: UUID
    card_brand: str
    card_expiry_date: str
    card_last_four: str
    created_at: datetime

    class Config:
        from_attributes = True


class SavedCardResponse(BaseModel):
    id: UUID
    card_brand: str
    card_expiry_date: str
    card_last_four: str

    class Config:
        from_attributes = True


class DeleteCardResponse(BaseModel):
    message: str
    success: bool


class ChargeRequest(BaseModel):
    amount: float
    card_id: Optional[UUID] = None
    currency: str = "USD"
    cvv: str
    payment_token: Optional[str] = None


class ChargeResponse(BaseModel):
    message: str
    success: bool
    transaction_id: str
