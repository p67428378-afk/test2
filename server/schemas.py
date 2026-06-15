from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
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


# New schemas for Hotel Management System
class RoomBase(BaseModel):
    room_number: str
    room_type: str
    price_per_night: float


class RoomCreate(RoomBase):
    pass


class RoomResponse(RoomBase):
    id: UUID

    class Config:
        from_attributes = True
        orm_mode = True


class GuestBase(BaseModel):
    full_name: str
    phone_number: str
    email_address: str


class GuestCreate(GuestBase):
    pass


class GuestResponse(GuestBase):
    id: UUID

    class Config:
        from_attributes = True
        orm_mode = True


class ReservationCreate(BaseModel):
    check_in_date: date
    check_out_date: date
    estimated_arrival_time: Optional[str] = None
    guest: GuestCreate
    number_of_guests: int = 1
    room_id: UUID


class ReservationUpdate(BaseModel):
    check_in_date: date
    check_out_date: date
    estimated_arrival_time: Optional[str] = None
    guest: GuestCreate
    number_of_guests: int = 1
    status: str = "Confirmed"


class ReservationResponse(BaseModel):
    id: UUID
    room_id: UUID
    guest_id: UUID
    check_in_date: date
    check_out_date: date
    number_of_guests: int
    estimated_arrival_time: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime
    room: RoomResponse
    guest: GuestResponse

    class Config:
        from_attributes = True
        orm_mode = True
