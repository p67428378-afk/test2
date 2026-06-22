from pydantic import BaseModel, EmailStr
from typing import Optional, Union
from datetime import datetime
from uuid import UUID


# Existing schemas
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


# New schemas for Photographer Portfolio & Booking


class GalleryBase(BaseModel):
    name: str
    description: Optional[str] = None


class GalleryCreate(GalleryBase):
    pass


class GalleryResponse(GalleryBase):
    id: UUID

    class Config:
        from_attributes = True


class ImageBase(BaseModel):
    url: str
    title: Optional[str] = None


class ImageCreate(ImageBase):
    gallery_id: Union[str, UUID]


class ImageResponse(ImageBase):
    id: UUID
    gallery_id: UUID

    class Config:
        from_attributes = True


class BookingBase(BaseModel):
    client_name: str
    client_email: EmailStr
    client_phone: Optional[str] = None
    session_type: str
    booking_date: datetime


class BookingCreate(BookingBase):
    pass


class BookingResponse(BookingBase):
    id: UUID
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class PaymentRequest(BaseModel):
    payment_method_id: str


class PaymentResponse(BaseModel):
    booking_id: UUID
    message: str
    status: str


class InquiryBase(BaseModel):
    name: str
    email: EmailStr
    message: str


class InquiryCreate(InquiryBase):
    pass


class InquiryResponse(BaseModel):
    message: str
    status: str
