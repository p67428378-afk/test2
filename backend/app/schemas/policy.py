from pydantic import BaseModel
from datetime import date

class PremiumCalculationRequest(BaseModel):
    vehicle_make: str
    vehicle_model: str
    vehicle_year: int
    ncb_level: int

class PremiumCalculationResponse(BaseModel):
    premium_amount: float

class PolicyBase(BaseModel):
    customer_id: str
    vehicle_id: str
    premium_amount: float
    start_date: date
    end_date: date
    applied_ncb: float
    applied_multiplier: float

class PolicyCreate(PolicyBase):
    pass

class Policy(PolicyBase):
    id: str

    class Config:
        orm_mode = True
