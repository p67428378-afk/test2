from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ----------------------
# Tour Schemas
# ----------------------
class TourBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    duration_minutes: int = Field(default=60, gt=0)


class TourCreate(TourBase):
    pass


class TourUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    duration_minutes: Optional[int] = Field(None, gt=0)


class TourResponse(TourBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ----------------------
# Guide Schemas
# ----------------------
class GuideBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    specialization: Optional[str] = None


class GuideCreate(GuideBase):
    pass


class GuideUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    specialization: Optional[str] = None


class GuideResponse(GuideBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ----------------------
# Schedule Schemas
# ----------------------
class ScheduleBase(BaseModel):
    tour_id: str
    guide_id: Optional[str] = None
    start_time: datetime
    end_time: datetime
    max_capacity: int = Field(default=20, gt=0)
    status: str = Field(default="Published")  # Draft, Published, Cancelled


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(BaseModel):
    tour_id: Optional[str] = None
    guide_id: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    max_capacity: Optional[int] = Field(None, gt=0)
    status: Optional[str] = None


class ScheduleAssignGuide(BaseModel):
    guide_id: str


class ScheduleResponse(BaseModel):
    id: str
    tour_id: str
    tour_title: Optional[str] = None
    guide_id: Optional[str] = None
    guide_name: Optional[str] = None
    start_time: datetime
    end_time: datetime
    max_capacity: int
    status: str
    booked_tickets: int = 0
    booked_count: int = 0
    remaining_capacity: int = 0
    available_capacity: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ----------------------
# Booking Schemas
# ----------------------
class BookingCreate(BaseModel):
    schedule_id: str
    visitor_name: str = Field(..., min_length=1, max_length=255)
    visitor_email: EmailStr
    ticket_quantity: int = Field(default=1, gt=0, le=50)


class BookingUpdate(BaseModel):
    booking_status: Optional[str] = None
    ticket_quantity: Optional[int] = Field(None, gt=0)


class BookingResponse(BaseModel):
    id: str
    schedule_id: str
    tour_title: Optional[str] = None
    visitor_name: str
    visitor_email: str
    ticket_quantity: int
    booking_status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ----------------------
# Attendance Schemas
# ----------------------
class AttendanceCheckInCreate(BaseModel):
    booking_id: str
    schedule_id: Optional[str] = None
    attended_count: int = Field(default=1, gt=0)
    notes: Optional[str] = None


class AttendanceResponse(BaseModel):
    id: str
    booking_id: str
    schedule_id: str
    visitor_name: Optional[str] = None
    attended_count: int
    check_in_time: datetime
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AttendanceReportResponse(BaseModel):
    schedule_id: str
    tour_title: str
    start_time: datetime
    end_time: datetime
    max_capacity: int
    total_booked_tickets: int
    total_attended_tickets: int
    attendance_rate_percentage: float
    check_ins: List[AttendanceResponse] = []

    model_config = ConfigDict(from_attributes=True)
