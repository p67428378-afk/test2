from typing import Optional
from pydantic import BaseModel


class FraudCheckRequest(BaseModel):
    amount: float
    beneficiary_name: str
    currency: str
    destination_country: str


class FraudCheckResponse(BaseModel):
    score_id: str
    score: float
    status: str
    details: Optional[str] = None

    class Config:
        from_attributes = True
