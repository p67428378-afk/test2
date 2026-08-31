"""Pydantic schemas and request/response models."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field, EmailStr


# ==========================================
# Tour Schemas
# ==========================================

class TourBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Title of the tour")
    description: Optional[str] = Field(None, description="Detailed description of the tour route")
    duration_minutes: int = Field(60, ge=15, le=480, description="Duration in minutes")


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


# ==========================================
# Guide Schemas
# ==========================================

class GuideBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Full name of the tour guide")
    email: EmailStr = Field(..., description="Unique email address of the tour guide")
    specialization: Optional[str] = Field(None, description="Area of expertise or specialization")


class GuideCreate(GuideBase):
    pass


class GuideResponse(GuideBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Schedule Schemas
# ==========================================

class ScheduleBase(BaseModel):
    tour_id: str = Field(..., description="ID of the associated tour")
    guide_id: Optional[str] = Field(None, description="Optional ID of the assigned guide")
    start_time: datetime = Field(..., description="Start timestamp of the tour slot")
    end_time: datetime = Field(..., description="End timestamp of the tour slot")
    max_capacity: int = Field(25, ge=1, le=500, description="Maximum visitor capacity limit")
    status: str = Field("Published", description="Schedule status: Draft, Published, Cancelled")


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(BaseModel):
    tour_id: Optional[str] = None
    guide_id: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    max_capacity: Optional[int] = Field(None, ge=1, le=500)
    status: Optional[str] = None


class GuideAssignRequest(BaseModel):
    guide_id: str = Field(..., description="ID of the guide to assign to the schedule")


class ScheduleResponse(BaseModel):
    id: str
    tour_id: str
    guide_id: Optional[str] = None
    start_time: datetime
    end_time: datetime
    max_capacity: int
    status: str
    tour_title: Optional[str] = None
    guide_name: Optional[str] = None
    booked_tickets: int = 0
    remaining_capacity: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Booking Schemas
# ==========================================

class BookingCreate(BaseModel):
    schedule_id: str = Field(..., description="ID of the tour schedule to book")
    visitor_name: str = Field(..., min_length=1, max_length=255, description="Full name of the lead visitor")
    visitor_email: EmailStr = Field(..., description="Contact email for confirmation")
    ticket_quantity: int = Field(1, ge=1, le=20, description="Number of tickets requested")


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


# ==========================================
# Attendance Schemas
# ==========================================

class AttendanceCheckInCreate(BaseModel):
    booking_id: str = Field(..., description="Reservation ID to check in")
    schedule_id: str = Field(..., description="Schedule slot ID")
    attended_count: int = Field(1, ge=1, description="Actual number of visitors present")
    notes: Optional[str] = Field(None, description="Optional notes or comments from the guide/admin")


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
    records: List[AttendanceResponse]
