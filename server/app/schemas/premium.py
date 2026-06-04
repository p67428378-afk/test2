
from pydantic import BaseModel

class PremiumInput(BaseModel):
    ncb_percentage: float
    vehicle_multiplier: float

class PremiumOutput(BaseModel):
    calculated_premium: float
