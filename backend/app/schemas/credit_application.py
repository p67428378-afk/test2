from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.models.credit_application import EmploymentStatus, ApplicationStatus

class CreditApplicationBase(BaseModel):
    full_name: str
    contact_information: str
    date_of_birth: date
    address: str
    employment_status: EmploymentStatus
    annual_income: float
    existing_credit_obligations: Optional[str] = None

class CreditApplicationCreate(CreditApplicationBase):
    pass

class CreditApplication(CreditApplicationBase):
    id: int
    credit_score: Optional[int] = None
    status: ApplicationStatus
    selected_credit_card_tier: Optional[str] = None

    class Config:
        from_attributes = True

class CreditCardTier(BaseModel):
    name: str
    apr: float
    credit_limit: int
    rewards_program: str
