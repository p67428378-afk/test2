from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional, List
from .credit_card import CreditCard

# Shared properties
class ApplicationBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone_number: str
    address: str
    date_of_birth: date
    annual_income: float
    employment_status: str

# Properties to receive on item creation
class ApplicationCreate(ApplicationBase):
    pass

# Properties to receive on item update
class ApplicationUpdate(ApplicationBase):
    pass

# Properties shared by models in DB
class ApplicationInDBBase(ApplicationBase):
    id: str
    credit_score: Optional[float] = None
    eligibility_status: str
    ineligibility_reason: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# Properties to return to client
class Application(ApplicationInDBBase):
    pass

# Properties stored in DB
class ApplicationInDB(ApplicationInDBBase):
    pass

class EligibilityResult(BaseModel):
    eligibility_status: str
    ineligibility_reason: Optional[str] = None
    eligible_products: List[CreditCard] = []
