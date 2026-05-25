from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date

class BeneficiaryBase(BaseModel):
    name: str
    relationship_type: str
    date_of_birth: date

class BeneficiaryCreate(BeneficiaryBase):
    pass

class Beneficiary(BeneficiaryBase):
    id: int
    policy_id: int

    class Config:
        from_attributes = True

class PolicyBase(BaseModel):
    policy_number: str
    coverage_type: str
    premium_amount: float
    status: str

class PolicyCreate(PolicyBase):
    effective_date: date
    expiration_date: date
    policy_holder_id: int

class PolicyUpdate(BaseModel):
    coverage_type: Optional[str] = None
    premium_amount: Optional[float] = None
    status: Optional[str] = None

class Policy(PolicyBase):
    id: int
    effective_date: date
    expiration_date: date
    policy_holder_id: int
    beneficiaries: List[Beneficiary] = []

    class Config:
        from_attributes = True

class PolicyHolderBase(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    address: str

class PolicyHolderCreate(PolicyHolderBase):
    password: str

class PolicyHolder(PolicyHolderBase):
    id: int
    policies: List[Policy] = []

    class Config:
        from_attributes = True
