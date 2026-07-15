from pydantic import BaseModel, Field, field_validator
from datetime import time, datetime
from typing import Optional
from uuid import UUID


class ScheduleSlotBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    day_of_week: str = Field(
        ..., pattern="^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$"
    )
    start_time: time
    end_time: time
    notes: Optional[str] = None

    @field_validator("end_time")
    @classmethod
    def validate_times(cls, end_time: time, info) -> time:
        start_time = info.data.get("start_time")
        if start_time is not None and end_time <= start_time:
            raise ValueError("End time cannot be earlier than or equal to start time.")
        return end_time


class ScheduleSlotCreate(ScheduleSlotBase):
    pass


class ScheduleSlotUpdate(ScheduleSlotBase):
    pass


class ScheduleSlotResponse(ScheduleSlotBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
