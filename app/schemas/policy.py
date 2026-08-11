from pydantic import BaseModel, Field
from typing import Optional
import datetime
import uuid
from enum import Enum

class VehicleType(str, Enum):
    ECONOMY = "Economy"
    STANDARD = "Standard"
    SPORT = "Sport"
    LUXURY = "Luxury"

class PremiumCalculationRequest(BaseModel):
    base_rate: float = Field(..., gt=0, description="Base rate for the insurance premium")
    no_claims_years: int = Field(..., ge=0, le=10, description="Number of no claims years (0-10)")
    vehicle_type: VehicleType = Field(..., description="Type of vehicle (e.g., Economy, Standard, Sport, Luxury)")

class PremiumCalculationResponse(BaseModel):
    calculated_premium: float = Field(..., description="Calculated insurance premium")
    ncb_discount_percentage: float = Field(..., description="Applied No Claims Bonus discount percentage")
    vehicle_multiplier: float = Field(..., description="Applied vehicle multiplier")

class PolicySchema(BaseModel):
    policy_id: uuid.UUID
    customer_id: str
    vehicle_type: VehicleType
    no_claims_years: int
    base_rate: float
    ncb_discount_percentage: float
    vehicle_multiplier: float
    calculated_premium: float
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True
