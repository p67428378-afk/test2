from pydantic import BaseModel, Field


class TipCalculationRequest(BaseModel):
    bill_amount: float = Field(..., gt=0.0, description="Total monetary amount of the bill before tip (must be > 0.0)")
    tip_percentage: float = Field(..., ge=0.0, le=100.0, description="Tip percentage (0.0 to 100.0)")
    num_people: int = Field(default=1, ge=1, description="Number of individuals splitting the bill (default: 1, minimum: 1)")


class TipCalculationResponse(BaseModel):
    total_tip: float = Field(..., description="Total calculated tip amount rounded to 2 decimal places")
    total_bill: float = Field(..., description="Sum of bill amount and total tip rounded to 2 decimal places")
    tip_per_person: float = Field(..., description="Tip portion allocated per individual rounded to 2 decimal places")
    total_per_person: float = Field(..., description="Combined bill and tip portion per individual rounded to 2 decimal places")
