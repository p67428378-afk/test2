from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class VehicleDetails(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None

class CustomerDetails(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

class PremiumCalculationRequest(BaseModel):
    baseRate: float = Field(..., gt=0, description="Base rate for the insurance premium")
    ncbTier: str = Field(..., description="No Claim Bonus tier (e.g., 'Tier 1', 'Tier 5')")
    vehicleMultiplier: float = Field(..., ge=0.8, le=1.6, description="Vehicle multiplier (0.8x to 1.6x)")
    vehicleDetails: Optional[VehicleDetails] = None
    customerDetails: Optional[CustomerDetails] = None

class PremiumCalculationResponse(BaseModel):
    premium: float = Field(..., description="Calculated insurance premium")
    policyId: str = Field(..., description="ID of the created policy")

class PolicyBase(BaseModel):
    baseRate: float
    ncbTier: str
    ncbDiscountPercentage: float
    vehicleMultiplier: float
    finalPremium: float
    vehicleDetails: Optional[Dict[str, Any]] = None
    customerDetails: Optional[Dict[str, Any]] = None

class PolicyCreate(PolicyBase):
    pass

class Policy(PolicyBase):
    policyId: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
