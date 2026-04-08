from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class PolicyholderBase(BaseModel):
    name: str
    address: str
    contact_info: str
    date_of_birth: date

class PolicyholderCreate(PolicyholderBase):
    pass

class PolicyholderResponse(PolicyholderBase):
    id: str

    class Config:
        from_attributes = True

class CoverageOptionBase(BaseModel):
    coverage_type: str
    details: str
    start_date: date
    end_date: date

class CoverageOptionCreate(CoverageOptionBase):
    pass

class CoverageOptionUpdate(CoverageOptionBase):
    pass

class CoverageOptionResponse(CoverageOptionBase):
    id: str
    policy_id: str

    class Config:
        from_attributes = True

class PolicyHistoryBase(BaseModel):
    action: str
    timestamp: date
    user: str
    changes_made: str

class PolicyHistoryResponse(PolicyHistoryBase):
    id: str
    policy_id: str

    class Config:
        from_attributes = True

class PolicyBase(BaseModel):
    policy_number: str
    policy_type: str
    effective_date: date
    expiration_date: date
    billing_date: date
    status: str
    premium_amount: float
    policyholder_id: str

class PolicyCreate(PolicyBase):
    pass

class PolicyUpdate(BaseModel):
    policy_type: Optional[str] = None
    effective_date: Optional[date] = None
    expiration_date: Optional[date] = None
    billing_date: Optional[date] = None
    status: Optional[str] = None
    premium_amount: Optional[float] = None

class PolicyResponse(PolicyBase):
    id: str
    coverage_options: List[CoverageOptionResponse] = []
    policy_history: List[PolicyHistoryResponse] = []

    class Config:
        from_attributes = True
