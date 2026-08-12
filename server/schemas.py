from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
import re

VALID_CLOCK_MODES = {"analog", "flip", "hybrid"}
VALID_THEMES = {"antique_brass", "wooden_mantle", "retro_neon"}
VALID_TIME_FORMATS = {"12h", "24h"}
VALID_SOUND_TYPES = {"mechanical_bell", "vintage_radio_chime"}
VALID_DAYS = {"MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"}


# Existing Password Reset schemas
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


# Library Management System schemas


# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError("Invalid email address format")
        return v


# User schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "member"

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError("Invalid email address format")
        return v


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError("Invalid email address format")
        return v


class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Book schemas
class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    genre: Optional[str] = None
    publication_year: Optional[int] = None
    total_copies: int = 1


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    genre: Optional[str] = None
    publication_year: Optional[int] = None
    total_copies: Optional[int] = None
    available_copies: Optional[int] = None


class BookResponse(BookBase):
    id: UUID
    available_copies: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Loan schemas
class LoanCreate(BaseModel):
    book_id: UUID
    member_id: UUID


class LoanResponse(BaseModel):
    id: UUID
    book_id: UUID
    member_id: UUID
    checkout_date: datetime
    due_date: datetime
    return_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    book: Optional[BookResponse] = None
    member: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# Fine schemas
class FineResponse(BaseModel):
    id: UUID
    loan_id: UUID
    amount: float
    status: str
    created_at: datetime
    updated_at: datetime
    loan: Optional[LoanResponse] = None

    class Config:
        from_attributes = True


# Inventory Item schemas
class InventoryItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: int = 0
    unit: str
    supplier: Optional[str] = None
    category: Optional[str] = None
    low_stock_threshold: int = 10

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Quantity cannot be negative")
        return v

    @field_validator("low_stock_threshold")
    @classmethod
    def validate_threshold(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Low stock threshold cannot be negative")
        return v


class InventoryItemCreate(InventoryItemBase):
    pass


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    supplier: Optional[str] = None
    category: Optional[str] = None
    low_stock_threshold: Optional[int] = None

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:
            raise ValueError("Quantity cannot be negative")
        return v

    @field_validator("low_stock_threshold")
    @classmethod
    def validate_threshold(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:
            raise ValueError("Low stock threshold cannot be negative")
        return v


class InventoryItemResponse(InventoryItemBase):
    item_id: UUID
    created_at: datetime
    updated_at: datetime
    is_low_stock: bool = False

    class Config:
        from_attributes = True


# Vintage Clock Schemas (SCRUM-49)
class ServerTime(BaseModel):
    utc_datetime: str
    timezone: str = "UTC"
    timestamp_ms: int
    local_datetime: Optional[str] = None


class AlarmBase(BaseModel):
    time: str
    label: str = "Alarm"
    enabled: bool = True
    repeat_days: List[str] = []
    sound_type: str = "mechanical_bell"
    snooze_duration_minutes: int = 5

    @field_validator("time")
    @classmethod
    def validate_time_format(cls, v: str) -> str:
        if not re.match(r"^([0-1][0-9]|2[0-3]):[0-5][0-9]$", v):
            raise ValueError("Time must be in HH:MM format (24-hour)")
        return v

    @field_validator("sound_type")
    @classmethod
    def validate_sound_type(cls, v: str) -> str:
        if v not in VALID_SOUND_TYPES:
            raise ValueError(
                f"Invalid sound_type. Must be one of: {', '.join(VALID_SOUND_TYPES)}"
            )
        return v

    @field_validator("repeat_days")
    @classmethod
    def validate_repeat_days(cls, v: List[str]) -> List[str]:
        for day in v:
            if day not in VALID_DAYS:
                raise ValueError(
                    f"Invalid day '{day}' in repeat_days. Must be one of: {', '.join(VALID_DAYS)}"
                )
        return v


class AlarmCreate(AlarmBase):
    pass


class AlarmUpdate(BaseModel):
    time: Optional[str] = None
    label: Optional[str] = None
    enabled: Optional[bool] = None
    repeat_days: Optional[List[str]] = None
    sound_type: Optional[str] = None
    snooze_duration_minutes: Optional[int] = None

    @field_validator("time")
    @classmethod
    def validate_time_format(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not re.match(r"^([0-1][0-9]|2[0-3]):[0-5][0-9]$", v):
            raise ValueError("Time must be in HH:MM format (24-hour)")
        return v

    @field_validator("sound_type")
    @classmethod
    def validate_sound_type(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_SOUND_TYPES:
            raise ValueError(
                f"Invalid sound_type. Must be one of: {', '.join(VALID_SOUND_TYPES)}"
            )
        return v

    @field_validator("repeat_days")
    @classmethod
    def validate_repeat_days(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        if v is not None:
            for day in v:
                if day not in VALID_DAYS:
                    raise ValueError(
                        f"Invalid day '{day}' in repeat_days. Must be one of: {', '.join(VALID_DAYS)}"
                    )
        return v


class AlarmResponse(AlarmBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserSettingsBase(BaseModel):
    clock_mode: str = "flip"
    theme_id: str = "antique_brass"
    time_format: str = "12h"
    show_second_hand: bool = True
    time_zone: str = "UTC"

    @field_validator("clock_mode")
    @classmethod
    def validate_clock_mode(cls, v: str) -> str:
        if v not in VALID_CLOCK_MODES:
            raise ValueError(
                f"Invalid clock_mode. Must be one of: {', '.join(VALID_CLOCK_MODES)}"
            )
        return v

    @field_validator("theme_id")
    @classmethod
    def validate_theme_id(cls, v: str) -> str:
        if v not in VALID_THEMES:
            raise ValueError(
                f"Invalid theme_id. Must be one of: {', '.join(VALID_THEMES)}"
            )
        return v

    @field_validator("time_format")
    @classmethod
    def validate_time_format(cls, v: str) -> str:
        if v not in VALID_TIME_FORMATS:
            raise ValueError(
                f"Invalid time_format. Must be one of: {', '.join(VALID_TIME_FORMATS)}"
            )
        return v


class UserSettingsUpdate(BaseModel):
    clock_mode: Optional[str] = None
    theme_id: Optional[str] = None
    time_format: Optional[str] = None
    show_second_hand: Optional[bool] = None
    time_zone: Optional[str] = None

    @field_validator("clock_mode")
    @classmethod
    def validate_clock_mode(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_CLOCK_MODES:
            raise ValueError(
                f"Invalid clock_mode. Must be one of: {', '.join(VALID_CLOCK_MODES)}"
            )
        return v

    @field_validator("theme_id")
    @classmethod
    def validate_theme_id(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_THEMES:
            raise ValueError(
                f"Invalid theme_id. Must be one of: {', '.join(VALID_THEMES)}"
            )
        return v

    @field_validator("time_format")
    @classmethod
    def validate_time_format(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_TIME_FORMATS:
            raise ValueError(
                f"Invalid time_format. Must be one of: {', '.join(VALID_TIME_FORMATS)}"
            )
        return v


class UserSettingsResponse(UserSettingsBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
