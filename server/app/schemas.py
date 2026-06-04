from pydantic import BaseModel, UUID4, Field

class PolicyBase(BaseModel):
    customer_id: UUID4
    vehicle_make: str
    vehicle_model: str
    ncb_percentage: int = Field(..., ge=20, le=50)
    vehicle_multiplier: float = Field(..., ge=0.8, le=1.6)

class PolicyCreate(PolicyBase):
    pass

class Policy(PolicyBase):
    policy_id: UUID4
    calculated_premium: float

    class Config:
        orm_mode = True

class PolicyResponse(BaseModel):
    policy_id: UUID4
    calculated_premium: float

    class Config:
        orm_mode = True

class PremiumCalculate(BaseModel):
    base_premium: float = Field(500.0, description="The base premium amount, fixed at 500.")
    ncb_percentage: int = Field(..., ge=20, le=50, description="No-Claim Bonus percentage (20-50).")
    vehicle_multiplier: float = Field(..., ge=0.8, le=1.6, description="Vehicle risk multiplier (0.8-1.6).")

class Premium(BaseModel):
    calculated_premium: float
