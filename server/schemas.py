from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


# --- Health ---
class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# --- Tours ---
class TourBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    duration_minutes: int = Field(default=60, ge=15, le=480)


class TourCreate(TourBase):
    pass


class TourUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    duration_minutes: Optional[int] = Field(None, ge=15, le=480)


class TourResponse(TourBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Guides ---
class GuideBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., min_length=3, max_length=255)
    specialization: Optional[str] = None


class GuideCreate(GuideBase):
    pass


class GuideResponse(GuideBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Schedules ---
class ScheduleBase(BaseModel):
    tour_id: str
    guide_id: Optional[str] = None
    start_time: datetime
    end_time: datetime
    max_capacity: int = Field(default=25, ge=1, le=500)
    status: str = Field(default="Published")  # Draft, Published, Cancelled


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(BaseModel):
    tour_id: Optional[str] = None
    guide_id: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    max_capacity: Optional[int] = Field(None, ge=1, le=500)
    status: Optional[str] = None


class AssignGuideRequest(BaseModel):
    guide_id: str = Field(..., min_length=1)


class ScheduleResponse(BaseModel):
    id: str
    tour_id: str
    guide_id: Optional[str] = None
    start_time: datetime
    end_time: datetime
    max_capacity: int
    status: str
    created_at: datetime
    updated_at: datetime

    # Enriched fields for frontend display
    tour_title: Optional[str] = None
    guide_name: Optional[str] = None
    booked_tickets: int = 0
    remaining_capacity: int = 0

    model_config = ConfigDict(from_attributes=True)


# --- Bookings ---
class BookingCreate(BaseModel):
    schedule_id: str = Field(..., min_length=1)
    visitor_name: str = Field(..., min_length=1, max_length=255)
    visitor_email: str = Field(..., min_length=3, max_length=255)
    ticket_quantity: int = Field(default=1, ge=1, le=10)


class BookingResponse(BaseModel):
    id: str
    schedule_id: str
    visitor_name: str
    visitor_email: str
    ticket_quantity: int
    booking_status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Attendance ---
class CheckInRequest(BaseModel):
    booking_id: str = Field(..., min_length=1)
    schedule_id: str = Field(..., min_length=1)
    attended_count: int = Field(default=1, ge=1)
    notes: Optional[str] = None


class AttendanceResponse(BaseModel):
    id: str
    booking_id: str
    schedule_id: str
    attended_count: int
    check_in_time: datetime
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AttendanceReportRecord(BaseModel):
    id: str
    booking_id: str
    visitor_name: str
    visitor_email: str
    booked_quantity: int
    attended_count: int
    check_in_time: datetime
    notes: Optional[str] = None


class AttendanceReportResponse(BaseModel):
    schedule_id: str
    tour_title: str
    start_time: datetime
    end_time: datetime
    max_capacity: int
    total_booked: int
    total_attended: int
    no_shows: int
    attendance_rate_percentage: float
    records: List[AttendanceReportRecord] = []

    model_config = ConfigDict(from_attributes=True)
