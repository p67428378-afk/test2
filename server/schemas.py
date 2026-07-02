from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


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


# Todo schemas
class TodoCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=255)


class TodoUpdate(BaseModel):
    text: Optional[str] = Field(None, min_length=1, max_length=255)
    is_completed: Optional[bool] = None


class TodoResponse(BaseModel):
    id: uuid.UUID
    text: str
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


class TodoDeleteResponse(BaseModel):
    message: str
