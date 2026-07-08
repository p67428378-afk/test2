from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, date as dt_date
from uuid import UUID


# Password Reset Schemas (Retained from original codebase)
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


# User Schemas
class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: UUID
    is_roundup_enabled: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Roundup Settings Schemas
class RoundupSettingsResponse(BaseModel):
    is_roundup_enabled: bool
    linked_account_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RoundupSettingsUpdate(BaseModel):
    is_roundup_enabled: bool


# Roundup Summary Schema
class RoundupSummaryResponse(BaseModel):
    is_roundup_enabled: bool
    today_invested_amount: float
    total_roundup_amount: float


# Transaction Schemas
class TransactionItem(BaseModel):
    id: UUID
    transaction_date: dt_date
    merchant_name: str
    amount: float
    roundup_amount: float
    status: str

    class Config:
        from_attributes = True


class TransactionListResponse(BaseModel):
    items: List[TransactionItem]
    total: int


# Daily Job Trigger Schema
class DailyJobTriggerResponse(BaseModel):
    status: str
    processed_users_count: int
    total_invested_amount: float
