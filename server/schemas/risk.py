from pydantic import BaseModel


class RiskValidationRequest(BaseModel):
    amount: float
    country: str
    currency: str


class RiskValidationResponse(BaseModel):
    reason: str
    valid: bool
