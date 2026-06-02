
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class WaterUsageBase(BaseModel):
    volume_gallons: float

class WaterUsageCreate(WaterUsageBase):
    user_id: UUID

class WaterUsage(WaterUsageBase):
    usage_id: UUID
    user_id: UUID
    timestamp: datetime

    class Config:
        orm_mode = True
