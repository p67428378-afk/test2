
from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class PolicyBase(BaseModel):
    policy_number: str
    plan_type: str
    premium_amount: float
    effective_date: date
    expiration_date: date
    status: str

class PolicyCreate(PolicyBase):
    pass

class Policy(PolicyBase):
    id: str
    policy_holder_id: str

    class Config:
        from_attributes = True

class PolicyHolderBase(BaseModel):
    name: str
    address: str
    contact_info: str

class PolicyHolderCreate(PolicyHolderBase):
    pass

class PolicyHolder(PolicyHolderBase):
    id: str
    policies: List[Policy] = []

    class Config:
        from_attributes = True

class PolicyUpdate(BaseModel):
    address: Optional[str] = None
    contact_info: Optional[str] = None
