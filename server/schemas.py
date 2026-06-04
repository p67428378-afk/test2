from pydantic import BaseModel
import uuid

class PremiumCalculationRequest(BaseModel):
    vehicle_value: float
    ncb_years: int
    vehicle_type_multiplier: float

class PremiumCalculationResponse(BaseModel):
    policy_id: uuid.UUID
    base_premium: float
    ncb_discount: float
    premium_after_ncb: float
    final_premium: float

    class Config:
        orm_mode = True
