from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class ApplicantBase(BaseModel):
    full_name: str
    ssn: str
    date_of_birth: date
    address: str
    annual_income: float
    employment_status: str
    credit_score: int

class ApplicantCreate(ApplicantBase):
    pass

class Applicant(ApplicantBase):
    applicant_id: str
    status: str
    credit_limit: Optional[float] = None

    class Config:
        from_attributes = True

class ApplicationStatus(BaseModel):
    applicant_id: str
    status: str
    credit_limit: Optional[float] = None
    decision_message: str