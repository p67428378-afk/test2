from datetime import date, datetime, time
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr


# Auth Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "visitor"


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None


# Visitor Schemas
class VisitorCreate(BaseModel):
    full_name: str
    national_id: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    photo_id_url: Optional[str] = None
    visitor_type: str = "STANDARD"  # STANDARD, LEGAL


class VisitorUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    photo_id_url: Optional[str] = None
    verification_status: Optional[str] = None
    visitor_type: Optional[str] = None


class VisitorResponse(BaseModel):
    id: str
    full_name: str
    national_id: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    photo_id_url: Optional[str] = None
    verification_status: str
    visitor_type: str
    is_watchlist_flagged: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Inmate Schemas
class InmateCreate(BaseModel):
    inmate_number: str
    full_name: str
    cell_location: str
    security_level: str = "MEDIUM"
    weekly_visit_limit: int = 2
    status: str = "ACTIVE"


class InmateResponse(BaseModel):
    id: str
    inmate_number: str
    full_name: str
    cell_location: str
    security_level: str
    weekly_visit_limit: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Digital Pass Schemas
class DigitalPassResponse(BaseModel):
    id: str
    appointment_id: str
    pass_token: str
    qr_code_data_url: str
    pdf_download_url: Optional[str] = None
    expires_at: datetime
    is_used: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Entry Exit Log Schemas
class EntryExitLogResponse(BaseModel):
    id: str
    appointment_id: str
    officer_id: str
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    entry_method: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ManualCheckInCreate(BaseModel):
    appointment_id: str
    officer_id: str


class CheckOutCreate(BaseModel):
    appointment_id: str
    officer_id: str


# Verification Schemas
class VerificationCreate(BaseModel):
    visitor_id: str
    officer_id: str
    verification_status: str  # VERIFIED, REJECTED, PENDING
    notes: Optional[str] = None


class VerificationResponse(BaseModel):
    id: str
    visitor_id: str
    officer_id: str
    verification_status: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Appointment Schemas
class AppointmentCreate(BaseModel):
    visitor_id: str
    inmate_id: str
    visit_date: date
    start_time: time
    slot_duration_minutes: int = 30  # 30 (Standard) or 60 (Legal)
    relationship: str


class AppointmentStatusUpdate(BaseModel):
    status: str  # APPROVED, REJECTED, CANCELLED
    rejection_reason: Optional[str] = None


class AppointmentResponse(BaseModel):
    id: str
    visitor_id: str
    inmate_id: str
    visit_date: date
    start_time: time
    slot_duration_minutes: int
    relationship: str
    status: str
    security_flag_status: str
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    visitor: Optional[VisitorResponse] = None
    inmate: Optional[InmateResponse] = None
    digital_pass: Optional[DigitalPassResponse] = None

    model_config = ConfigDict(from_attributes=True)


# Watchlist Schemas
class WatchlistCreate(BaseModel):
    national_id: str
    full_name: str
    reason: str
    severity_level: str = "HIGH"
    flagged_by: Optional[str] = "SYSTEM"
    is_active: bool = True


class WatchlistResponse(BaseModel):
    id: str
    national_id: str
    full_name: str
    reason: str
    severity_level: str
    flagged_by: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WatchlistScreenRequest(BaseModel):
    national_id: str
    full_name: Optional[str] = None


class WatchlistScreenResponse(BaseModel):
    is_flagged: bool
    national_id: str
    match_details: Optional[WatchlistResponse] = None
    message: str


# QR Gate Scanning Schemas
class QRScanRequest(BaseModel):
    qr_pass_token: str
    officer_id: str
    gate_id: str = "GATE-01"


class QRScanResponse(BaseModel):
    status: str
    message: str
    check_in_timestamp: datetime
    appointment_id: str
    visitor_name: str
    inmate_name: str
    duration_minutes: int
    security_status: str


# Visitor History
class VisitorHistoryResponse(BaseModel):
    visitor: VisitorResponse
    appointments: List[AppointmentResponse]
    verifications: List[VerificationResponse]
    entry_exit_logs: List[EntryExitLogResponse]
