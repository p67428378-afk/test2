from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# Artist Schemas
class ArtistBase(BaseModel):
    name: str
    genre: str
    tech_spec_summary: Optional[str] = None


class ArtistCreate(ArtistBase):
    pass


class ArtistResponse(ArtistBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Stage Schemas
class StageBase(BaseModel):
    name: str
    location_zone: str
    max_capacity: int = 10000


class StageCreate(StageBase):
    pass


class StageResponse(StageBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StageNotificationResponse(BaseModel):
    id: str
    stage_id: str
    performance_id: Optional[str] = None
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


# Performance Schemas
class PerformanceCreate(BaseModel):
    artist_id: str
    start_time: datetime
    end_time: datetime
    buffer_minutes: int = 30


class PerformanceDelayRequest(BaseModel):
    delay_minutes: int = Field(..., gt=0)


class PerformanceResponse(BaseModel):
    id: str
    stage_id: str
    artist_id: str
    start_time: datetime
    end_time: datetime
    buffer_minutes: int
    status: str
    artist: Optional[ArtistResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Volunteer Schemas
class VolunteerBase(BaseModel):
    full_name: str
    email: str
    phone: str
    assigned_zone: str
    status: str = "ACTIVE"


class VolunteerCreate(VolunteerBase):
    pass


class VolunteerResponse(VolunteerBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Volunteer Shift Schemas
class VolunteerShiftCreate(BaseModel):
    volunteer_id: Optional[str] = None
    zone_name: str
    start_time: datetime
    end_time: datetime


class VolunteerShiftCheckInRequest(BaseModel):
    volunteer_id: Optional[str] = None


class VolunteerShiftDropRequest(BaseModel):
    reason: Optional[str] = None


class StandbyAlertResponse(BaseModel):
    id: str
    shift_id: Optional[str] = None
    zone_name: str
    alert_type: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


class VolunteerShiftResponse(BaseModel):
    id: str
    volunteer_id: Optional[str] = None
    zone_name: str
    start_time: datetime
    end_time: datetime
    check_in_time: Optional[datetime] = None
    status: str
    volunteer: Optional[VolunteerResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Ticket Schemas
class TicketCreate(BaseModel):
    ticket_code: str
    tier: str = "General Admission"


class TicketResponse(BaseModel):
    id: str
    ticket_code: str
    tier: str
    status: str
    scanned_at: Optional[datetime] = None
    scanned_gate: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TicketValidationRequest(BaseModel):
    qr_payload: str
    gate_id: str = "Gate-1"
    device_timestamp: Optional[datetime] = None


class TicketValidationResponse(BaseModel):
    status: str  # ACCESS_GRANTED or ACCESS_DENIED
    ticket_id: Optional[str] = None
    tier: Optional[str] = None
    scanned_at: Optional[datetime] = None
    reason: Optional[str] = None
    message: Optional[str] = None


class TicketSyncItem(BaseModel):
    ticket_code: str
    gate_id: str
    scanned_at: datetime


class TicketSyncRequest(BaseModel):
    scanned_tickets: List[TicketSyncItem]


class TicketSyncResponse(BaseModel):
    synchronized_count: int
    rejected_count: int
    details: List[dict]


# Telemetry / Crowd Analytics Schemas
class TelemetryIngestRequest(BaseModel):
    zone_id: str
    sensor_id: str
    ingress_count: int = 0
    egress_count: int = 0
    current_occupancy: Optional[int] = None
    timestamp: Optional[datetime] = None


class TelemetryIngestBatch(BaseModel):
    events: List[TelemetryIngestRequest]


class ZoneCrowdStatus(BaseModel):
    zone_id: str
    zone_name: str
    current_occupancy: int
    max_capacity: int
    occupancy_percentage: float
    density_status: str  # NORMAL, YELLOW_WARNING, RED_ALERT
    rate_of_change_2min: int
    rate_of_change_alert: bool
