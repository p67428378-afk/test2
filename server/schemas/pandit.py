
from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import List, Optional

class AvailabilityBase(BaseModel):
    start_time: datetime
    end_time: datetime
    is_blocked: bool

class Availability(AvailabilityBase):
    class Config:
        orm_mode = True

class PanditAvailabilityResponse(BaseModel):
    pandit_id: UUID4
    availability: List[Availability]

class BlockAvailabilityRequest(BaseModel):
    start_time: datetime
    end_time: datetime
    reason: Optional[str] = None

class DailyBookingResponse(BaseModel):
    booking_id: UUID4
    devotee_name: str
    puja_type: str
    start_time: datetime
    location: Optional[str] = None
