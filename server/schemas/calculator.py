from pydantic import BaseModel, Field


class TipCalculationRequest(BaseModel):
    """Request schema for tip calculation."""

    bill_amount: float = Field(
        ...,
        gt=0.0,
        description="Total bill amount before tip. Must be greater than 0.0.",
    )
    tip_percentage: float = Field(
        ..., ge=0.0, le=100.0, description="Tip percentage between 0.0 and 100.0."
    )
    num_people: int = Field(
        default=1,
        ge=1,
        description="Number of people splitting the bill. Must be an integer >= 1.",
    )


class TipCalculationResponse(BaseModel):
    """Response schema containing calculated tip and split breakdowns."""

    total_tip: float = Field(
        ..., description="Total tip amount rounded to 2 decimal places."
    )
    total_bill: float = Field(
        ..., description="Total bill amount including tip, rounded to 2 decimal places."
    )
    tip_per_person: float = Field(
        ..., description="Tip amount owed per person, rounded to 2 decimal places."
    )
    total_per_person: float = Field(
        ...,
        description="Total amount owed per person (bill + tip), rounded to 2 decimal places.",
    )
