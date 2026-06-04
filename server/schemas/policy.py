
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

class PolicyBase(BaseModel):
    base_rate: float
    ncb_percentage: float
    vehicle_multiplier: float

class PolicyCreate(PolicyBase):
    pass

class Policy(PolicyBase):
    id: uuid.UUID
    calculated_premium: float
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
