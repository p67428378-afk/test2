from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID


# Auth Schemas
class Token(BaseModel):
    access_token: str
    role: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


class LoginRequest(BaseModel):
    username: EmailStr
    password: str


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: UUID

    class Config:
        from_attributes = True


# Real-time Energy Data Schemas
class RealtimeEnergyResponse(BaseModel):
    system_id: UUID
    current_power_kw: float
    efficiency_pct: float
    today_generation_kwh: float
    status: str
    updated_at: datetime

    class Config:
        from_attributes = True


# Analytics Schemas
class GenerationDataPoint(BaseModel):
    date: str
    kwh: float


class UsageBreakdown(BaseModel):
    battery_storage_kwh: float
    grid_export_kwh: float
    household_kwh: float


class AnalyticsResponse(BaseModel):
    system_id: UUID
    period: str
    generation_data: List[GenerationDataPoint]
    usage_breakdown: UsageBreakdown

    class Config:
        from_attributes = True


# Alert Schemas
class AlertResponse(BaseModel):
    alert_id: UUID = Field(..., alias="id")
    system_id: UUID
    severity: str
    description: str
    is_resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True


# Service Request Schemas
class ServiceRequestResponse(BaseModel):
    request_id: UUID = Field(..., alias="id")
    system_id: UUID
    customer_name: str
    alert_details: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True


class ServiceRequestUpdateRequest(BaseModel):
    status: str
    notes: Optional[str] = None


class ServiceRequestUpdateResponse(BaseModel):
    request_id: UUID = Field(..., alias="id")
    status: str
    notes: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
