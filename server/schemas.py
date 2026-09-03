"""Pydantic schemas for Aura Photography Studio Management System."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ----------------- User & Auth Schemas -----------------
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "Customer"


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user: Optional[UserOut] = None


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# ----------------- Photographer Schemas -----------------
class PhotographerBase(BaseModel):
    bio: Optional[str] = None
    specialization: Optional[str] = None
    is_active: bool = True


class PhotographerCreate(PhotographerBase):
    user_id: str


class PhotographerOut(PhotographerBase):
    id: str
    user_id: str
    full_name: Optional[str] = None
    email: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TimeSlotOut(BaseModel):
    start_time: str
    end_time: str
    is_available: bool
    is_blocked: bool = False
    reason: Optional[str] = None


class AvailabilityCreate(BaseModel):
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    day_of_week: Optional[int] = None
    blocked_date: Optional[str] = None
    reason: Optional[str] = None
    is_blocked: bool = False


class AvailabilityOut(BaseModel):
    id: str
    photographer_id: str
    day_of_week: Optional[int] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    blocked_date: Optional[str] = None
    block_reason: Optional[str] = None
    is_blocked: bool
    created_at: datetime
    warning: Optional[str] = None
    conflicting_sessions: Optional[List[Dict[str, Any]]] = []

    model_config = ConfigDict(from_attributes=True)


# ----------------- Package & AddOn Schemas -----------------
class AddOnBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., ge=0.0)


class AddOnCreate(AddOnBase):
    pass


class AddOnOut(AddOnBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PackageBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., ge=0.0)
    duration_minutes: int = Field(default=60, gt=0)
    deliverables_summary: Optional[str] = None


class PackageCreate(PackageBase):
    pass


class PackageUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, ge=0.0)
    duration_minutes: Optional[int] = Field(None, gt=0)
    deliverables_summary: Optional[str] = None


class PackageOut(PackageBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ----------------- Photoshoot Record Schemas -----------------
class PhotoshootRecordCreate(BaseModel):
    gallery_url: Optional[str] = None
    notes: Optional[str] = None
    is_completed: bool = False


class PhotoshootRecordOut(BaseModel):
    id: str
    session_id: str
    gallery_url: Optional[str] = None
    notes: Optional[str] = None
    is_completed: bool
    unpaid_balance_warning: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ----------------- Payment Schemas -----------------
class PaymentCreate(BaseModel):
    session_id: str
    amount: float = Field(..., gt=0.0)
    payment_method: str = "credit_card"
    transaction_reference: Optional[str] = None


class PaymentOut(BaseModel):
    id: str
    session_id: str
    amount: float
    payment_method: str
    payment_status: str
    transaction_reference: Optional[str] = None
    session_status: Optional[str] = None
    remaining_balance: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ----------------- Session Schemas -----------------
class SessionCreate(BaseModel):
    photographer_id: str
    package_id: str
    start_time: datetime
    event_notes: Optional[str] = None
    add_on_ids: Optional[List[str]] = []


class SessionUpdateStatus(BaseModel):
    status: str


class SessionOut(BaseModel):
    id: str
    customer_id: str
    photographer_id: str
    package_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    event_notes: Optional[str] = None
    total_price: float
    deposit_amount: float
    status: str
    hold_expires_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    customer_name: Optional[str] = None
    package_name: Optional[str] = None
    photographer_name: Optional[str] = None
    remaining_balance: Optional[float] = None
    photoshoot_record: Optional[PhotoshootRecordOut] = None

    model_config = ConfigDict(from_attributes=True)


# ----------------- Extended Feature Schemas -----------------
class FeatureCreate(BaseModel):
    feature_name: str = Field(..., min_length=1, max_length=100)
    configuration: Optional[Any] = "{}"
    status: Optional[str] = "Active"


class FeatureUpdate(BaseModel):
    feature_name: Optional[str] = None
    configuration: Optional[Any] = None
    status: Optional[str] = None


class FeatureOut(BaseModel):
    id: str
    feature_name: str
    configuration: Any
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
