import uuid
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict


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


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1)
    assignee: Optional[str] = None


class TaskUpdate(BaseModel):
    status: Literal["To Do", "In Progress", "Done"]
    assignee: Optional[str] = None


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    status: Literal["To Do", "In Progress", "Done"]
    assignee: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class WebSocketMessage(BaseModel):
    event: Literal["task_created", "task_updated"]
    data: TaskResponse
