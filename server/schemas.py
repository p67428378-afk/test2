from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime, time
import uuid


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


# New Schedule Slot Schemas
VALID_DAYS = {
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
}


class ScheduleSlotBase(BaseModel):
    event_title: str = Field(..., max_length=255)
    day_of_week: str
    start_time: time
    end_time: time
    notes_location: Optional[str] = None

    @field_validator("day_of_week")
    @classmethod
    def validate_day_of_week(cls, v: str) -> str:
        # Capitalize first letter to normalize (e.g. monday -> Monday)
        normalized = v.strip().capitalize()
        if normalized not in VALID_DAYS:
            raise ValueError(
                f"Invalid day of week. Must be one of: {', '.join(VALID_DAYS)}"
            )
        return normalized


class ScheduleSlotCreate(ScheduleSlotBase):
    user_id: Optional[uuid.UUID] = None

    @field_validator("end_time")
    @classmethod
    def validate_times(cls, end_time: time, info) -> time:
        start_time = info.data.get("start_time")
        if start_time is not None and end_time <= start_time:
            raise ValueError("End time must be later than start time")
        return end_time


class ScheduleSlotUpdate(ScheduleSlotBase):
    @field_validator("end_time")
    @classmethod
    def validate_times(cls, end_time: time, info) -> time:
        start_time = info.data.get("start_time")
        if start_time is not None and end_time <= start_time:
            raise ValueError("End time must be later than start time")
        return end_time


class ScheduleSlotResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    event_title: str
    day_of_week: str
    start_time: time
    end_time: time
    notes_location: Optional[str] = None
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
