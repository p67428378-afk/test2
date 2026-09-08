from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# ---------------- Auth Schemas ----------------
class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True


# ---------------- Room Schemas ----------------
class RoomBase(BaseModel):
    room_number: str
    room_type: str
    daily_rate: float
    status: Optional[str] = "Available"


class RoomCreate(RoomBase):
    pass


class RoomUpdateStatus(BaseModel):
    status: str = Field(..., description="Available, Occupied, Cleaning, Maintenance")


class RoomOut(RoomBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------------- Guest Schemas ----------------
class GuestBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str


class GuestCreate(GuestBase):
    pass


class GuestOut(GuestBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------------- Reservation Schemas ----------------
class GuestInfo(BaseModel):
    full_name: str
    email: EmailStr
    phone: str


class ReservationCreate(BaseModel):
    guest: GuestInfo
    room_type: str
    start_date: date
    end_date: date
    room_id: Optional[str] = None


class ReservationUpdate(BaseModel):
    room_type: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    room_id: Optional[str] = None
    status: Optional[str] = None
    guest: Optional[GuestInfo] = None


class ReservationOut(BaseModel):
    id: str
    guest_id: str
    room_id: Optional[str] = None
    room_type: str
    start_date: date
    end_date: date
    status: str
    created_at: datetime
    updated_at: datetime
    guest: Optional[GuestOut] = None
    room: Optional[RoomOut] = None

    class Config:
        from_attributes = True


# ---------------- Check-In & Check-Out Schemas ----------------
class CheckInRequest(BaseModel):
    reservation_id: str
    room_id: Optional[str] = None


class CheckOutRequest(BaseModel):
    reservation_id: str
    service_fees: Optional[float] = 0.0
    discount_amount: Optional[float] = 0.0
    promo_code: Optional[str] = None


# ---------------- Invoice Schemas ----------------
class InvoiceItemOut(BaseModel):
    id: str
    invoice_id: str
    description: str
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True


class InvoiceOut(BaseModel):
    id: str
    reservation_id: str
    room_charges: float
    tax_amount: float
    service_fees: float
    discount_amount: float
    total_amount: float
    payment_status: str
    created_at: datetime
    updated_at: datetime
    items: List[InvoiceItemOut] = []
    reservation: Optional[ReservationOut] = None

    class Config:
        from_attributes = True


class PaymentRequest(BaseModel):
    amount: Optional[float] = None
    discount_amount: Optional[float] = 0.0
    promo_code: Optional[str] = None
    payment_method: Optional[str] = "card"
    card_last4: Optional[str] = "4242"
