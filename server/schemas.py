import uuid
from datetime import datetime

from pydantic import BaseModel


class PremiumCalculationRequest(BaseModel):
    vehicle_type: str
    no_claim_years: int


class CalculationDetails(BaseModel):
    base_rate: float
    vehicle_multiplier: float
    ncb_discount_percentage: float


class PremiumCalculationResponse(BaseModel):
    premium: float
    calculation_details: CalculationDetails


class PolicyBase(BaseModel):
    customer_id: uuid.UUID
    vehicle_make: str
    vehicle_model: str
    vehicle_year: int
    vehicle_type: str
    no_claim_years: int
    premium_amount: float
    start_date: datetime
    end_date: datetime


class PolicyCreate(PolicyBase):
    pass


class Policy(PolicyBase):
    policy_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class PolicyList(BaseModel):
    policies: list[Policy]
