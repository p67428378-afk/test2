from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional


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


# --- New Electricity Monitoring Platform Schemas ---


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "user"


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Energy Source Schemas
class EnergySourceBase(BaseModel):
    name: str
    type: str
    status: str = "active"


class EnergySourceResponse(EnergySourceBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# Realtime Metric Schemas
class RealtimeMetricBase(BaseModel):
    energy_source_id: str
    metric_name: str
    metric_value: float


class RealtimeMetricResponse(RealtimeMetricBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True


# Historical Metric Schemas
class HistoricalMetricBase(BaseModel):
    energy_source_id: str
    metric_name: str
    metric_value: float
    timestamp: datetime


class HistoricalMetricResponse(HistoricalMetricBase):
    id: str

    class Config:
        from_attributes = True


# Alert Schemas
class AlertBase(BaseModel):
    energy_source_id: str
    parameter_name: str
    parameter_value: float
    threshold_value: float
    severity: str = "warning"
    status: str = "active"


class AlertResponse(AlertBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# Service Request Schemas
class ActivityLogItem(BaseModel):
    action: str
    author: str
    comment: str
    timestamp: str


class ServiceRequestCreate(BaseModel):
    alert_id: Optional[str] = None
    description: str
    equipment: str
    location: str


class ServiceRequestUpdate(BaseModel):
    status: str
    comment: Optional[str] = None


class ServiceRequestResponse(BaseModel):
    id: str
    alert_id: Optional[str] = None
    equipment: str
    location: str
    description: str
    status: str
    assigned_technician_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    activity_log: List[ActivityLogItem] = []

    class Config:
        from_attributes = True
