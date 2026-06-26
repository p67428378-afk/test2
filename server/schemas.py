from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from uuid import UUID


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


# New Leave Management Schemas
class LoginRequest(BaseModel):
    login_id: str
    password: str


class UserResponse(BaseModel):
    id: UUID
    login_id: str
    name: str
    email: str
    role: str
    leave_balance: int

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class LeaveRequestCreate(BaseModel):
    leave_type: str
    start_date: date
    end_date: date
    reason: str


class LeaveRequestResponse(BaseModel):
    id: UUID
    employee_id: UUID
    manager_id: UUID
    leave_type: str
    start_date: date
    end_date: date
    reason: str
    status: str
    manager_comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TeamLeaveRequestResponse(LeaveRequestResponse):
    employee_name: str

    class Config:
        from_attributes = True


class LeaveRequestStatusUpdate(BaseModel):
    status: str
    comment: Optional[str] = None
