
from pydantic import BaseModel
import uuid
import datetime

class WaterUsageBase(BaseModel):
    volume_gallons: float

class WaterUsageCreate(WaterUsageBase):
    user_id: uuid.UUID

class WaterUsage(WaterUsageBase):
    usage_id: uuid.UUID
    user_id: uuid.UUID
    timestamp: datetime.datetime

    class Config:
        orm_mode = True
