
from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import List, Optional

class BeneficiaryBase(BaseModel):
    name: str
    beneficiary_relationship: str
    date_of_birth: date

class BeneficiaryCreate(BeneficiaryBase):
    pass

class Beneficiary(BeneficiaryBase):
    id: int
    policy_id: int
    model_config = ConfigDict(from_attributes=True)

class PolicyHolderBase(BaseModel):
    name: str
    contact_information: str
    address: str

class PolicyHolderCreate(PolicyHolderBase):
    pass

class PolicyHolder(PolicyHolderBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class PolicyBase(BaseModel):
    coverage_type: str
    start_date: date
    end_date: date
    premium_amount: float
    status: str

class PolicyCreate(PolicyBase):
    pass

class Policy(PolicyBase):
    id: int
    policy_holder_id: int
    beneficiaries: List[Beneficiary] = []
    model_config = ConfigDict(from_attributes=True)

class PolicyUpdate(BaseModel):
    coverage_type: Optional[str] = None
    premium_amount: Optional[float] = None
    status: Optional[str] = None
