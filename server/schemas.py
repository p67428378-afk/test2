from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


# Auth Schemas
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = Field(..., description="restaurant|ngo|volunteer|admin")
    address: str
    phone_number: Optional[str] = None


class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    role: str
    address: str
    phone_number: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: str
    password: str


class UserMinResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    role: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserMinResponse


# User Update Schema
class UserUpdate(BaseModel):
    address: str
    full_name: str
    is_active: bool
    phone_number: Optional[str] = None


# Donation Schemas
class DonationCreate(BaseModel):
    best_before_dt: datetime
    description: str
    quantity: str
    food_type: Optional[str] = None
    pickup_location: Optional[str] = None


class DonationResponse(BaseModel):
    id: UUID
    restaurant_id: UUID
    description: str
    quantity: str
    status: str
    best_before_dt: datetime
    food_type: Optional[str] = None
    pickup_location: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DonationListResponse(BaseModel):
    id: UUID
    restaurant_id: UUID
    restaurant_name: str
    description: str
    quantity: str
    status: str
    best_before_dt: datetime
    food_type: Optional[str] = None
    pickup_location: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Donation Request Schemas
class DonationRequestResponse(BaseModel):
    id: UUID
    donation_id: UUID
    ngo_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Delivery Schemas
class DeliveryListResponse(BaseModel):
    id: UUID
    request_id: UUID
    volunteer_id: Optional[UUID] = None
    status: str
    description: str
    quantity: str
    pickup_address: str
    delivery_address: str

    class Config:
        from_attributes = True


class DeliveryAcceptResponse(BaseModel):
    id: UUID
    request_id: UUID
    volunteer_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DeliveryStatusUpdate(BaseModel):
    status: str = Field(..., description="picked_up|delivered")


class DeliveryStatusResponse(BaseModel):
    id: UUID
    request_id: UUID
    volunteer_id: UUID
    status: str
    pickup_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    updated_at: datetime

    class Config:
        from_attributes = True
