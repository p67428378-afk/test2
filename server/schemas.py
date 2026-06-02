
from pydantic import BaseModel, UUID4
from datetime import date, time
from typing import List, Optional

class Availability(BaseModel):
    date: date
    is_blocked: bool

class AvailabilityUpdate(BaseModel):
    dates: List[date]
    is_blocked: bool

class Shift(BaseModel):
    date: date
    shift: str
    location: Optional[str] = None

class DailyAgenda(BaseModel):
    time: time
    puja_type: str
    location: Optional[str] = None
    devotee_id: UUID4

class SankalpaDetails(BaseModel):
    name: str
    family_members: Optional[str] = None # Changed from List[str]
    gothra: Optional[str] = None
    nakshatra: Optional[str] = None
    rashi: Optional[str] = None
    purpose: Optional[str] = None
