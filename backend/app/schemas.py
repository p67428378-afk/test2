from pydantic import BaseModel, Field

class PremiumRequest(BaseModel):
    base_rate: float = Field(..., example=500.0, description="The base premium rate.")
    ncb: float = Field(..., example=0.3, ge=0, description="No Claims Bonus (NCB) as a decimal (e.g., 0.3 for 30%).")
    vehicle_multiplier: float = Field(..., example=1.2, ge=0, description="Vehicle-specific multiplier.")

class PremiumResponse(BaseModel):
    calculated_premium: float = Field(..., description="The calculated insurance premium.")
