from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date
from typing import Optional
from uuid import UUID


# Existing Password Reset Schemas (Preserved exactly as originally defined)
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


# Auth Schemas
class UserLogin(BaseModel):
    username_or_email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: UUID


# Visitor Schemas
class VisitorRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    date_of_birth: date


class VisitorResponse(BaseModel):
    id: UUID
    full_name: str
    email: EmailStr
    id_verification_status: str

    class Config:
        from_attributes = True


class VisitorIDUploadResponse(BaseModel):
    id: UUID
    id_document_url: str
    id_verification_status: str

    class Config:
        from_attributes = True


# Appointment Schemas
class AppointmentCreate(BaseModel):
    inmate_id: UUID
    requested_datetime: datetime


class AppointmentResponse(BaseModel):
    id: UUID
    visitor_id: UUID
    inmate_id: UUID
    requested_datetime: datetime
    status: str

    class Config:
        from_attributes = True


class AppointmentStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(approved|denied)$")


class AppointmentStatusResponse(BaseModel):
    id: UUID
    status: str
    approved_by_staff_id: Optional[UUID] = None

    class Config:
        from_attributes = True


# Visit Log Schemas
class CheckInRequest(BaseModel):
    appointment_id: UUID
    notes: Optional[str] = None


class CheckInResponse(BaseModel):
    id: UUID
    appointment_id: UUID
    check_in_time: datetime
    supervising_officer_id: UUID

    class Config:
        from_attributes = True


class CheckOutRequest(BaseModel):
    visit_log_id: UUID
    notes: Optional[str] = None


class CheckOutResponse(BaseModel):
    id: UUID
    check_in_time: datetime
    check_out_time: datetime
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class InmateHistoryResponse(BaseModel):
    id: UUID
    check_in_time: datetime
    check_out_time: Optional[datetime] = None
    notes: Optional[str] = None
    visitor_name: str

    class Config:
        from_attributes = True
