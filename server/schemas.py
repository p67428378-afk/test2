from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, date


# Existing Password Reset Schemas
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


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    phone: Optional[str] = None

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


# Package Schemas
class PackageItemResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    destination: str
    duration_days: int
    image_url: Optional[str] = None
    rating: float
    inclusions: List[str]

    class Config:
        from_attributes = True


class PackageListResponse(BaseModel):
    items: List[PackageItemResponse]
    total: int


class ItineraryItem(BaseModel):
    day: int
    title: str
    description: str


class ReviewResponse(BaseModel):
    id: str
    user_name: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True


class PackageDetailResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    destination: str
    duration_days: int
    image_url: Optional[str] = None
    rating: float
    inclusions: List[str]
    itinerary: List[ItineraryItem]
    reviews: List[ReviewResponse]

    class Config:
        from_attributes = True


# Booking Schemas
class PrimaryTraveler(BaseModel):
    name: str
    email: EmailStr
    phone: str


class AdditionalTraveler(BaseModel):
    name: str


class TravelerInfo(BaseModel):
    primary_traveler: PrimaryTraveler
    additional_travelers: Optional[List[AdditionalTraveler]] = []


class BookingCreate(BaseModel):
    package_id: str
    start_date: date
    end_date: date
    number_of_travelers: int = Field(..., ge=1)
    traveler_info: TravelerInfo


class BookingUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    number_of_travelers: Optional[int] = Field(None, ge=1)
    traveler_info: Optional[TravelerInfo] = None
    status: Optional[str] = None  # e.g., cancelled


class BookingCreateResponse(BaseModel):
    booking_id: str
    created_at: datetime
    status: str
    total_price: float

    class Config:
        from_attributes = True


class BookingDetailResponse(BaseModel):
    id: str
    package_id: str
    package_name: str
    start_date: date
    end_date: date
    number_of_travelers: int
    traveler_info: TravelerInfo
    total_price: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserBookingItem(BaseModel):
    id: str
    package_id: str
    package_name: str
    start_date: date
    end_date: date
    total_price: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Payment Schemas
class PaymentCreate(BaseModel):
    booking_id: str
    payment_method: str  # e.g., credit_card, paypal
    amount: float
    card_number: Optional[str] = None
    cvv: Optional[str] = None
    expiry_date: Optional[str] = None


class PaymentResponse(BaseModel):
    amount: float
    booking_id: str
    created_at: datetime
    payment_id: str
    status: str
    transaction_id: Optional[str] = None

    class Config:
        from_attributes = True
