from pydantic import BaseModel, EmailStr
from typing import List
from datetime import datetime, date
from uuid import UUID


# --- Existing Password Reset Schemas ---
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


# --- New TrekGuide Portal Schemas ---
class GuideBase(BaseModel):
    email: EmailStr
    full_name: str


class GuideCreate(GuideBase):
    password: str


class GuideResponse(GuideBase):
    id: UUID

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    guide: GuideResponse


class BookingResponse(BaseModel):
    id: UUID
    guide_id: UUID
    client_name: str
    client_email: EmailStr
    trek_name: str
    start_date: date
    end_date: date
    status: str
    payment_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BookingUpdateStatus(BaseModel):
    status: str  # confirmed or cancelled


class AvailabilityResponse(BaseModel):
    id: UUID
    guide_id: UUID
    unavailable_date: date
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AvailabilityUpdate(BaseModel):
    unavailable_dates: List[date]


class MessageResponse(BaseModel):
    id: UUID
    booking_id: UUID
    sender_id: UUID
    message_body: str
    sent_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    message_body: str
