from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import List, Optional

class PolicyBase(BaseModel):
    policy_number: str
    coverage_type: str
    premium_amount: float
    effective_date: date
    expiration_date: date

class PolicyCreate(PolicyBase):
    pass

class PolicyUpdate(BaseModel):
    premium_amount: Optional[float] = None

class Policy(PolicyBase):
    id: int
    policy_holder_id: int

    model_config = ConfigDict(from_attributes=True)

class PolicyHolderBase(BaseModel):
    email: str

class PolicyHolderCreate(PolicyHolderBase):
    password: str

class PolicyHolder(PolicyHolderBase):
    id: int
    policies: List[Policy] = []

    model_config = ConfigDict(from_attributes=True)
