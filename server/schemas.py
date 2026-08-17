from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# User Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: str = Field(..., description="donor, ngo, volunteer, admin")
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    role: str
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# Donation Schemas
class DonationCreate(BaseModel):
    category: str
    quantity: float
    preparation_time: datetime
    storage_condition: str
    pickup_address: str
    estimated_shelf_life: int


class DonationResponse(BaseModel):
    id: str
    donor_id: str
    category: str
    quantity: float
    preparation_time: datetime
    storage_condition: str
    pickup_address: str
    estimated_shelf_life: int
    freshness_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DonationFreshnessUpdate(BaseModel):
    freshness_status: str


# Claim Schemas
class ClaimCreate(BaseModel):
    donation_id: str
    quantity: float
    target_pickup_time: datetime


class ClaimResponse(BaseModel):
    id: str
    donation_id: str
    ngo_id: str
    quantity: float
    target_pickup_time: datetime
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Delivery Schemas
class DeliveryResponse(BaseModel):
    id: str
    claim_id: str
    volunteer_id: Optional[str] = None
    status: str
    photo_url: Optional[str] = None
    signature: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DeliveryStatusUpdate(BaseModel):
    status: str
    photo_url: Optional[str] = None
    signature: Optional[str] = None


# Freshness Log Schema
class FreshnessLogResponse(BaseModel):
    id: str
    donation_id: str
    old_status: str
    new_status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Admin Analytics Schema
class AdminAnalytics(BaseModel):
    total_rescued_kg: float
    active_routes: int
    successful_deliveries_count: int
    total_claims_count: int
