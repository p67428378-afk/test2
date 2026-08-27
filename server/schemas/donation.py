from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr, field_validator


class DonationCreate(BaseModel):
    campaign_id: str
    donor_name: str = Field(..., min_length=1)
    donor_email: EmailStr
    amount: float

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError("Donation amount must be greater than zero.")
        return v


class DonationResponse(BaseModel):
    id: str
    campaign_id: str
    user_id: Optional[str] = None
    donor_name: str
    donor_email: EmailStr
    amount: float
    payment_status: str
    transaction_id: str
    created_at: datetime
    campaign_title: Optional[str] = None

    class Config:
        from_attributes = True


class DonationListResponse(BaseModel):
    items: List[DonationResponse]
    total: int
    skip: int
    limit: int
