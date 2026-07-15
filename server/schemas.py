from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime
from uuid import UUID


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    gov_id: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str


class VisitorResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    phone: Optional[str]
    gov_id: str
    is_verified: bool

    class Config:
        from_attributes = True


# Inmate Schemas
class InmateResponse(BaseModel):
    id: UUID
    full_name: str
    inmate_number: str
    cell_location: Optional[str]

    class Config:
        from_attributes = True


# Appointment Schemas
class AppointmentCreate(BaseModel):
    inmate_id: UUID
    requested_date: date
    time_slot: str


class AppointmentResponse(BaseModel):
    id: UUID
    visitor_id: UUID
    inmate_id: UUID
    requested_date: date
    time_slot: str
    status: str
    denial_reason: Optional[str] = None

    class Config:
        from_attributes = True


class AppointmentPendingResponse(BaseModel):
    id: UUID
    requested_date: date
    time_slot: str
    status: str
    visitor: VisitorResponse
    inmate: InmateResponse

    class Config:
        from_attributes = True


class AppointmentUpdate(BaseModel):
    status: str  # approved, denied
    denial_reason: Optional[str] = None


# Visit Log Schemas
class CheckInRequest(BaseModel):
    appointment_id: UUID


class CheckOutRequest(BaseModel):
    visit_log_id: UUID


class VisitLogResponse(BaseModel):
    id: UUID
    appointment_id: UUID
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True


class VisitHistoryResponse(BaseModel):
    id: UUID
    visitor_name: str
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    status: str

    class Config:
        from_attributes = True


# Security Flag Schemas
class SecurityFlagCreate(BaseModel):
    visitor_id: UUID
    reason: str


class SecurityFlagResponse(BaseModel):
    id: UUID
    visitor_id: UUID
    reason: str
    is_active: bool = True

    class Config:
        from_attributes = True
