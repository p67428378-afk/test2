from pydantic import BaseModel

class PremiumCalculationRequest(BaseModel):
    vehicle_value: float
    ncb_percentage: float
    vehicle_multiplier: float

class PremiumCalculationResponse(BaseModel):
    calculated_premium: float
