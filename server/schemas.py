from pydantic import BaseModel, Field
from typing import Optional, List
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


# New Gas Pipeline Management Schemas

class PipelineResponse(BaseModel):
    id: UUID
    name: str
    location: str
    status: str

    class Config:
        from_attributes = True


class PressureReadingSchema(BaseModel):
    timestamp: datetime
    value: float

    class Config:
        from_attributes = True


class SensorResponse(BaseModel):
    id: UUID
    pipeline_id: UUID
    type: str
    location: str
    current_reading: Optional[float] = None
    status: str
    readings_24h: List[PressureReadingSchema] = []

    class Config:
        from_attributes = True


class AlertResponse(BaseModel):
    id: UUID
    sensor_id: UUID
    pipeline_id: UUID
    severity: str
    status: str
    location: str
    timestamp: datetime

    class Config:
        from_attributes = True


class AlertAcknowledgeResponse(BaseModel):
    id: UUID
    status: str


class MaintenanceCreateRequest(BaseModel):
    pipeline_id: UUID
    description: str
    assigned_to: str
    priority: str  # low, medium, high
    due_date: datetime


class MaintenanceUpdateRequest(BaseModel):
    assigned_to: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None  # pending, in_progress, completed


class MaintenanceResponse(BaseModel):
    id: UUID
    pipeline_id: UUID
    description: str
    assigned_to: str
    priority: str
    due_date: datetime
    status: str

    class Config:
        from_attributes = True
