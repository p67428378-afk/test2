from datetime import datetime as dt_datetime, date as dt_date
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict, model_validator


# User & Auth Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[str] = "customer"


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: str


class UserOut(UserBase):
    id: str
    is_active: bool
    created_at: dt_datetime
    updated_at: dt_datetime
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    email: str
    full_name: str


class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None
    role: Optional[str] = None


# Photographer Schemas
class PhotographerBase(BaseModel):
    bio: Optional[str] = None
    specialties: Optional[str] = None


class PhotographerCreate(PhotographerBase):
    user_id: Optional[str] = None


class PhotographerOut(PhotographerBase):
    id: str
    user_id: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    created_at: dt_datetime
    updated_at: dt_datetime
    model_config = ConfigDict(from_attributes=True)


# Availability Schemas
class AvailabilityBase(BaseModel):
    date: Optional[dt_date] = None
    blocked_date: Optional[dt_date] = None
    day_of_week: Optional[int] = None
    start_time: Optional[str] = "09:00"
    end_time: Optional[str] = "17:00"
    is_blocked: bool = False
    reason: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def populate_blocked_date(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "blocked_date" in data and data["blocked_date"] and not data.get("date"):
                data["date"] = data["blocked_date"]
                data["is_blocked"] = True
            elif "date" in data and data["date"] and data.get("is_blocked"):
                data["blocked_date"] = data["date"]
        return data


class AvailabilityCreate(AvailabilityBase):
    pass


class AvailabilityOut(BaseModel):
    id: str
    photographer_id: str
    date: Optional[dt_date] = None
    day_of_week: Optional[int] = None
    start_time: str
    end_time: str
    is_blocked: bool = False
    reason: Optional[str] = None
    created_at: dt_datetime
    updated_at: dt_datetime
    model_config = ConfigDict(from_attributes=True)


class SlotOut(BaseModel):
    start_time: str
    end_time: str
    is_available: bool
    date: str


class ConflictingSessionSummary(BaseModel):
    session_id: str
    start_time: str
    end_time: str
    customer_name: Optional[str] = None
    status: str


class AvailabilitySetResponse(BaseModel):
    availability: Optional[AvailabilityOut] = None
    warning: Optional[str] = None
    conflicting_sessions: List[ConflictingSessionSummary] = []


# Package Schemas
class PackageBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration_minutes: int
    price: float
    deliverables_summary: Optional[str] = None


class PackageCreate(PackageBase):
    pass


class PackageUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    price: Optional[float] = None
    deliverables_summary: Optional[str] = None
    is_active: Optional[bool] = None


class PackageOut(PackageBase):
    id: str
    is_active: bool
    created_at: dt_datetime
    updated_at: dt_datetime
    model_config = ConfigDict(from_attributes=True)


# AddOn and Photoshoot Record Schemas
class AddOnOption(BaseModel):
    id: str
    name: str
    price: float
    description: Optional[str] = None


class PhotoshootRecordCreate(BaseModel):
    gallery_url: Optional[str] = None
    notes: Optional[str] = None
    is_completed: bool = True


class PhotoshootRecordOut(BaseModel):
    id: str
    session_id: str
    gallery_url: Optional[str] = None
    notes: Optional[str] = None
    is_completed: bool
    unpaid_notice_flag: bool
    notice: Optional[str] = None
    created_at: dt_datetime
    updated_at: dt_datetime
    model_config = ConfigDict(from_attributes=True)


# Session Schemas
class SessionCreate(BaseModel):
    photographer_id: str
    package_id: str
    start_time: dt_datetime
    event_notes: Optional[str] = None
    add_on_ids: Optional[List[str]] = []


class SessionOut(BaseModel):
    id: str
    customer_id: str
    photographer_id: str
    package_id: str
    start_time: dt_datetime
    end_time: dt_datetime
    status: str
    total_price: float
    deposit_amount: float
    hold_expires_at: Optional[dt_datetime] = None
    event_notes: Optional[str] = None
    add_ons: Optional[str] = None
    created_at: dt_datetime
    updated_at: dt_datetime
    model_config = ConfigDict(from_attributes=True)


class SessionDetailOut(SessionOut):
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    photographer_name: Optional[str] = None
    package_name: Optional[str] = None
    paid_amount: float = 0.0
    remaining_balance: float = 0.0
    photoshoot_record: Optional[PhotoshootRecordOut] = None


class SessionStatusUpdate(BaseModel):
    status: str


# Payment Schemas
class PaymentCreate(BaseModel):
    session_id: str
    amount: float
    payment_method: str = "credit_card"
    transaction_reference: Optional[str] = None


class PaymentOut(BaseModel):
    id: str
    session_id: str
    amount: float
    payment_status: str
    payment_method: str
    transaction_reference: Optional[str] = None
    created_at: dt_datetime
    updated_at: dt_datetime
    model_config = ConfigDict(from_attributes=True)


class PaymentProcessResponse(BaseModel):
    payment: PaymentOut
    payment_status: str
    total_paid: float
    remaining_balance: float
    session_status: str
