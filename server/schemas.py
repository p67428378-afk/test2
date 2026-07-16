from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from uuid import UUID


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: str = Field(..., description="'broker' or 'buyer'")
    full_name: str
    phone: Optional[str] = None
    broker_license: Optional[str] = None
    broker_agency: Optional[str] = None


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    role: str
    full_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# Property Schemas
class PropertyCreate(BaseModel):
    address: str
    price: float
    property_type: str
    status: str = "ACTIVE"
    bedrooms: int
    bathrooms: int
    description: Optional[str] = None
    images: Optional[List[str]] = []


class PropertyUpdate(BaseModel):
    address: Optional[str] = None
    price: Optional[float] = None
    property_type: Optional[str] = None
    status: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None


class BrokerInfo(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    broker_agency: Optional[str] = None

    class Config:
        from_attributes = True


class PropertyResponse(BaseModel):
    id: UUID
    address: str
    price: float
    property_type: str
    status: str
    bedrooms: int
    bathrooms: int
    description: Optional[str] = None
    broker_id: UUID
    created_at: datetime
    images: List[str] = []

    class Config:
        from_attributes = True


class PropertyDetailResponse(BaseModel):
    id: UUID
    address: str
    price: float
    property_type: str
    status: str
    bedrooms: int
    bathrooms: int
    description: Optional[str] = None
    created_at: datetime
    images: List[str] = []
    broker: BrokerInfo

    class Config:
        from_attributes = True


# Message Schemas
class MessageCreate(BaseModel):
    content: str
    property_id: UUID
    receiver_id: UUID


class MessageResponse(BaseModel):
    id: UUID
    content: str
    property_id: UUID
    receiver_id: UUID
    sender_id: UUID
    timestamp: datetime = Field(..., alias="created_at")

    class Config:
        from_attributes = True
        populate_by_name = True


class MessageListResponse(BaseModel):
    id: UUID
    content: str
    property_id: UUID
    property_address: str
    receiver_id: UUID
    receiver_name: str
    sender_id: UUID
    sender_name: str
    timestamp: datetime = Field(..., alias="created_at")

    class Config:
        from_attributes = True
        populate_by_name = True
