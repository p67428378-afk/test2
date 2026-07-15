from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from uuid import UUID


# --- Password Reset Schemas (Legacy) ---
class PasswordResetInitiateRequest(BaseModel):
    login_id: str
    mobile_number: str


class PasswordResetInitiateResponse(BaseModel):
    otp_session_id: str
    security_question: str


class OTPVerifyRequest(BaseModel):
    otp_code: str
    otp_session_id: str


class OTPVerifyResponse(BaseModel):
    security_question_session_id: str


class SecurityQuestionVerifyRequest(BaseModel):
    answer: str
    security_question_session_id: str


class SecurityQuestionVerifyResponse(BaseModel):
    password_reset_session_id: str


class SetNewPasswordRequest(BaseModel):
    new_password: str
    password_reset_session_id: str


class SetNewPasswordResponse(BaseModel):
    status: str
    login_link: str


# --- House Broker App Schemas ---
class BrokerRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class BrokerResponse(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Property Image Schemas
class PropertyImageBase(BaseModel):
    image_url: str


class PropertyImageResponse(PropertyImageBase):
    id: UUID

    class Config:
        from_attributes = True


# Property Schemas
class PropertyCreate(BaseModel):
    title: str
    description: str
    location: str
    price: float
    bedrooms: int
    bathrooms: int
    image_urls: Optional[List[str]] = None


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    price: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    image_urls: Optional[List[str]] = None


class PropertyResponse(BaseModel):
    id: UUID
    broker_id: UUID
    title: str
    description: str
    location: str
    price: float
    bedrooms: int
    bathrooms: int
    created_at: datetime
    images: List[PropertyImageResponse] = []

    class Config:
        from_attributes = True


# Inquiry Schemas
class InquiryCreate(BaseModel):
    property_id: UUID
    name: str
    email: EmailStr
    message: str


class InquiryResponse(BaseModel):
    id: UUID
    property_id: UUID
    name: str
    email: EmailStr
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


# Dashboard Schemas
class DashboardListing(BaseModel):
    id: UUID
    title: str
    price: float
    inquiries_count: int


class DashboardResponse(BaseModel):
    active_listings_count: int
    new_inquiries_count: int
    total_views_count: int
    listings: List[DashboardListing]
