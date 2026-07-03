# server/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime


class EventBase(BaseModel):
    title: str
    description: str
    date_time: datetime
    location: str
    category: str
    image_url: Optional[str] = None


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date_time: Optional[datetime] = None
    location: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None


class EventResponse(EventBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RegistrationBase(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    agree_reminders: bool = True


class RegistrationCreate(RegistrationBase):
    pass


class RegistrationResponse(RegistrationBase):
    id: str
    event_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class FeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comments: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: str
    event_id: str
    rating: int
    comments: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AdminLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class MonthlyTrend(BaseModel):
    month: str
    registrations: int


class AnalyticsReport(BaseModel):
    total_events: int
    total_registrations: int
    attendance_rate: float
    category_distribution: Dict[str, int]
    monthly_trends: List[MonthlyTrend]
