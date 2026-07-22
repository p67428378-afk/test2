import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


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


# Task Schemas
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, description="The title of the task")
    assignee: Optional[str] = Field(None, description="The assignee of the task")


class TaskUpdate(BaseModel):
    status: str = Field(..., description="The status of the task")

    class Config:
        json_schema_extra = {"example": {"status": "In Progress"}}


class TaskResponse(BaseModel):
    id: uuid.UUID
    title: str
    assignee: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WebSocketResponse(BaseModel):
    event: str
    data: TaskResponse
