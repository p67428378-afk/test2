
from pydantic import BaseModel
from enum import Enum

class VehicleType(str, Enum):
    Hatchback = "Hatchback"
    Sedan = "Sedan"
    SUV = "SUV"

class PremiumCalculationRequest(BaseModel):
    vehicle_value: float
    ncb_years: int
    vehicle_type: VehicleType

class PremiumCalculationResponse(BaseModel):
    calculated_premium: float
