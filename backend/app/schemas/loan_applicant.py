from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
import uuid

class LoanEligibilityRequest(BaseModel):
    credit_score: int = Field(..., ge=300, le=850)
    annual_income: float = Field(..., ge=0)
    monthly_debts: float = Field(..., ge=0)

class LoanApplicantCreate(LoanEligibilityRequest):
    pass

class LoanApplicantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    applicant_id: str
    eligibility_status: bool
    interest_rate: Optional[float] = None
    ineligibility_reasons: Optional[List[str]] = None
