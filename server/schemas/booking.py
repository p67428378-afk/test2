
from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import List, Optional

class DevoteeSankalpaResponse(BaseModel):
    name: str
    family_members: Optional[List[str]] = None
    gothra: Optional[str] = None
    nakshatra: Optional[str] = None
    rashi: Optional[str] = None
    purpose: Optional[str] = None

class BookingDetailsResponse(BaseModel):
    booking_id: UUID4
    puja_type: str
    start_time: datetime
    devotee: DevoteeSankalpaResponse
