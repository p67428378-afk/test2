from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


# --- Auth & User Schemas ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    is_active: bool

    class Config:
        from_attributes = True


# --- Artist Schemas ---
class ArtistCreate(BaseModel):
    name: str
    genre: Optional[str] = None
    contact_email: Optional[EmailStr] = None


class ArtistResponse(BaseModel):
    id: str
    name: str
    genre: Optional[str] = None
    contact_email: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Stage Schemas ---
class StageCreate(BaseModel):
    name: str
    location_zone: str
    capacity: int = 5000


class StageOut(BaseModel):
    id: str
    name: str
    location_zone: str
    capacity: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Performance Schemas ---
class PerformanceCreate(BaseModel):
    artist_id: str
    stage_id: str
    start_time: datetime
    end_time: datetime


class PerformanceResponse(BaseModel):
    id: str
    artist_id: str
    stage_id: str
    start_time: datetime
    end_time: datetime
    status: str
    created_at: datetime
    artist: Optional[ArtistResponse] = None
    stage: Optional[StageOut] = None

    class Config:
        from_attributes = True


# --- Volunteer & Shift Schemas ---
class VolunteerCreate(BaseModel):
    user_id: str
    phone: Optional[str] = None
    assigned_zone: Optional[str] = None


class VolunteerResponse(BaseModel):
    id: str
    user_id: str
    phone: Optional[str] = None
    assigned_zone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ShiftCreate(BaseModel):
    volunteer_id: str
    zone: str
    start_time: datetime
    end_time: datetime


class ShiftCheckInRequest(BaseModel):
    shift_id: str
    volunteer_id: str


class ShiftResponse(BaseModel):
    id: str
    volunteer_id: str
    zone: str
    start_time: datetime
    end_time: datetime
    status: str
    check_in_time: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Ticket & Gate Schemas ---
class TicketCreate(BaseModel):
    ticket_code: str
    tier: str = "General Admission"


class TicketValidateRequest(BaseModel):
    ticket_code: str
    qr_payload: Optional[str] = None
    gate_name: str = "Main Gate"


class TicketValidateResponse(BaseModel):
    status: str  # 'VALID', 'INVALID', 'DUPLICATE_PASSBACK'
    message: str
    tier: Optional[str] = None
    scanned_at: datetime


class TicketOut(BaseModel):
    id: str
    ticket_code: str
    tier: str
    is_used: bool
    used_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Crowd Analytics Schemas ---
class CrowdDensityStage(BaseModel):
    stage_id: str
    stage_name: str
    location_zone: str
    current_occupancy: int
    max_capacity: int
    occupancy_ratio: float
    alert_status: str  # 'NORMAL', 'THRESHOLD_EXCEEDED_85', 'CRITICAL'


class CrowdDensityResponse(BaseModel):
    total_attendees: int
    active_scans_per_min: int
    active_volunteers: int
    active_stages: int
    stages: List[CrowdDensityStage]
