from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date

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

# Fund Transfer Schemas
class TransferInitiateRequest(BaseModel):
    amount: float
    currency: str
    destination_account_id: UUID
    source_account_id: UUID
    transfer_type: str

class TransferInitiateResponse(BaseModel):
    created_at: str
    status: str
    transaction_id: UUID

class TransferQueryResponse(BaseModel):
    amount: float
    created_at: str
    destination_account_id: UUID
    source_account_id: UUID
    status: str
    transaction_id: UUID
    updated_at: str

# Trekking Guide Schemas
class BookingClient(BaseModel):
    name: str

class BookingTrek(BaseModel):
    name: str

class BookingResponse(BaseModel):
    client: BookingClient
    end_date: str
    id: UUID
    start_date: str
    status: str
    trek: BookingTrek

class AvailabilityResponse(BaseModel):
    date: str
    end_time: str
    is_available: bool
    start_time: str

class NotificationRequest(BaseModel):
    client_id: UUID
    message: str

class NotificationResponse(BaseModel):
    message_id: UUID
    success: bool
