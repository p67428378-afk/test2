from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field, ConfigDict


# --- Tour Schemas ---
class TourBase(BaseModel):
    title: str
    description: Optional[str] = None
    duration_minutes: int = 60


class TourCreate(TourBase):
    pass


class TourUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None


class TourResponse(TourBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Guide Schemas ---
class GuideBase(BaseModel):
    name: str
    email: str
    specialization: Optional[str] = None


class GuideCreate(GuideBase):
    pass


class GuideUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    specialization: Optional[str] = None


class GuideResponse(GuideBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Schedule Schemas ---
class ScheduleBase(BaseModel):
    tour_id: str
    guide_id: Optional[str] = None
    start_time: datetime
    end_time: datetime
    max_capacity: int = 25
    status: str = "Published"


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(BaseModel):
    tour_id: Optional[str] = None
    guide_id: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    max_capacity: Optional[int] = None
    status: Optional[str] = None


class AssignGuideRequest(BaseModel):
    guide_id: str


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
    remaining_capacity: int = 25
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AttendanceReportResponse(BaseModel):
    schedule_id: str
    tour_title: str
    start_time: datetime
    end_time: datetime
    max_capacity: int
    total_booked_tickets: int
    total_attended_tickets: int
    no_shows: int
    attendance_rate_percentage: float


# --- Booking Schemas ---
class BookingCreate(BaseModel):
    schedule_id: str
    visitor_name: str
    visitor_email: str
    ticket_quantity: int = Field(1, ge=1)


class BookingUpdate(BaseModel):
    visitor_name: Optional[str] = None
    visitor_email: Optional[str] = None
    ticket_quantity: Optional[int] = None
    booking_status: Optional[str] = None


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


# --- Attendance Schemas ---
class AttendanceCheckInRequest(BaseModel):
    booking_id: str
    schedule_id: Optional[str] = None
    attended_count: int = Field(1, ge=1)
    notes: Optional[str] = None


class AttendanceResponse(BaseModel):
    id: str
    booking_id: str
    schedule_id: Optional[str] = None
    attended_count: int
    check_in_time: datetime
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Review Schemas ---
class ReviewCreate(BaseModel):
    booking_id: str
    rating: int = Field(..., ge=1, le=5, description="1 to 5 integer rating")
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: str
    booking_id: str
    tour_id: str
    guide_id: Optional[str] = None
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GuideMetricsResponse(BaseModel):
    guide_id: str
    guide_name: str
    average_rating: float
    total_reviews: int
    rating_breakdown: Dict[str, int]
    recent_comments: List[str]


class TourSummaryItem(BaseModel):
    tour_id: str
    tour_title: str
    average_rating: float
    total_reviews: int


class FeedbackSummaryResponse(BaseModel):
    total_reviews_collected: int
    system_average_rating: float
    tours_summary: List[TourSummaryItem]
