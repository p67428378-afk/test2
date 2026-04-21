
from pydantic import BaseModel
from typing import Optional, List

class LoanApplicantBase(BaseModel):
    credit_score: int
    annual_income: float
    monthly_debts: float

class LoanApplicantCreate(LoanApplicantBase):
    pass

class LoanApplicant(LoanApplicantBase):
    id: str
    eligibility_status: str
    interest_rate: Optional[float] = None
    ineligibility_reasons: Optional[List[str]] = None

    class Config:
        from_attributes = True
