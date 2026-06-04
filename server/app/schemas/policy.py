
from pydantic import BaseModel
from datetime import date

class PremiumInput(BaseModel):
    base_rate: float
    ncb_percentage: float
    vehicle_multiplier: float

class PremiumOutput(BaseModel):
    final_premium: float

class PolicyBase(BaseModel):
    customer_id: str
    vehicle_id: str
    start_date: date
    end_date: date

class PolicyCreate(PolicyBase):
    pass

class Policy(PolicyBase):
    id: str
    base_premium: float
    ncb_percentage: float
    vehicle_multiplier: float
    final_premium: float

    class Config:
        orm_mode = True
