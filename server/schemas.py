from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


# --- USER SCHEMAS ---
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "Visitor"


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    role: str
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- TOUR SCHEMAS ---
class TourCreate(BaseModel):
    name: str
    description: Optional[str] = None
    duration_minutes: int = 60


class TourUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None


class TourResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: Optional[str] = None
    duration_minutes: int
    created_at: datetime


# --- SCHEDULE SCHEMAS ---
class ScheduleCreate(BaseModel):
    tour_id: str
    guide_id: Optional[str] = None
    start_time: datetime
    max_capacity: int = Field(gt=0)


class ScheduleUpdate(BaseModel):
    tour_id: Optional[str] = None
    guide_id: Optional[str] = None
    start_time: Optional[datetime] = None
    max_capacity: Optional[int] = None


class ScheduleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    tour_id: str
    guide_id: Optional[str] = None
    start_time: datetime
    max_capacity: int
    booked_tickets: int = 0
    remaining_capacity: int = 0
    tour: Optional[TourResponse] = None
    guide: Optional[UserResponse] = None


# --- BOOKING SCHEMAS ---
class BookingCreate(BaseModel):
    schedule_id: str
    ticket_count: int = Field(default=1, gt=0)


class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    schedule_id: str
    visitor_id: str
    ticket_count: int
    status: str
    created_at: datetime
    schedule: Optional[ScheduleResponse] = None
    visitor: Optional[UserResponse] = None


# --- ATTENDANCE SCHEMAS ---
class AttendanceCheckIn(BaseModel):
    booking_id: str
    status: str = "Checked-in"  # Checked-in, No-show, Unchecked


class AttendanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    booking_id: str
    status: str
    checked_in_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    visitor_name: Optional[str] = None
    ticket_count: Optional[int] = None
    booking: Optional[BookingResponse] = None
