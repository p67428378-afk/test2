from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import date

# Beneficiary Schemas
class BeneficiaryBase(BaseModel):
    name: str
    relationship_type: str
    date_of_birth: date

class BeneficiaryCreate(BeneficiaryBase):
    pass

class BeneficiaryUpdate(BeneficiaryBase):
    pass

class Beneficiary(BeneficiaryBase):
    id: int
    policy_id: int
    model_config = ConfigDict(from_attributes=True)

# Policy Schemas
class PolicyBase(BaseModel):
    policy_number: str
    coverage_type: str
    effective_date: date
    expiration_date: date
    premium_amount: float
    status: str = "Active"

class PolicyCreate(PolicyBase):
    beneficiaries: List[BeneficiaryCreate] = []

class PolicyUpdate(PolicyBase):
    pass

class Policy(PolicyBase):
    id: int
    policy_holder_id: int
    beneficiaries: List[Beneficiary] = []
    model_config = ConfigDict(from_attributes=True)

# PolicyHolder Schemas
class PolicyHolderBase(BaseModel):
    first_name: str
    last_name: str
    email: str

class PolicyHolderCreate(PolicyHolderBase):
    pass

class PolicyHolderUpdate(PolicyHolderBase):
    pass

class PolicyHolder(PolicyHolderBase):
    id: int
    policies: List[Policy] = []
    model_config = ConfigDict(from_attributes=True)
