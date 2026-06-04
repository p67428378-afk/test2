from pydantic import BaseModel
import uuid
from datetime import datetime

class PolicyBase(BaseModel):
    base_rate: float
    ncb_percentage: float
    vehicle_multiplier: float

class PolicyCreate(PolicyBase):
    pass

class PolicyUpdate(PolicyBase):
    pass

class PolicyInDBBase(PolicyBase):
    id: uuid.UUID
    final_premium: float
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Policy(PolicyInDBBase):
    pass

class PolicyInDB(PolicyInDBBase):
    pass
