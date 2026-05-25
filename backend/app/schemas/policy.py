from pydantic import BaseModel, ConfigDict
from typing import List, Optional
import uuid
from datetime import date

# PolicyHolder
class PolicyHolderBase(BaseModel):
    name: str
    address: str
    contact_info: str

class PolicyHolderCreate(PolicyHolderBase):
    authentication_details: str

class PolicyHolderUpdate(PolicyHolderBase):
    pass

class PolicyHolderInDBBase(PolicyHolderBase):
    id: str
    model_config = ConfigDict(from_attributes=True)

class PolicyHolder(PolicyHolderInDBBase):
    pass

# Policy
class PolicyBase(BaseModel):
    policy_number: str
    plan_type: str
    premium_amount: float
    effective_date: date
    expiration_date: date
    status: str

class PolicyCreate(PolicyBase):
    policy_holder_id: str

class PolicyUpdate(BaseModel):
    plan_type: Optional[str] = None
    premium_amount: Optional[float] = None
    status: Optional[str] = None

class PolicyInDBBase(PolicyBase):
    id: str
    policy_holder_id: str
    model_config = ConfigDict(from_attributes=True)

class Policy(PolicyInDBBase):
    pass

# CoverageDetails
class CoverageDetailsBase(BaseModel):
    type: str
    limits: str
    deductibles: str

class CoverageDetailsCreate(CoverageDetailsBase):
    policy_id: str

class CoverageDetailsUpdate(CoverageDetailsBase):
    pass

class CoverageDetailsInDBBase(CoverageDetailsBase):
    id: str
    policy_id: str
    model_config = ConfigDict(from_attributes=True)

class CoverageDetails(CoverageDetailsInDBBase):
    pass

# Beneficiary
class BeneficiaryBase(BaseModel):
    name: str
    relationship_type: str
    contact_info: str

class BeneficiaryCreate(BeneficiaryBase):
    policy_id: str

class BeneficiaryUpdate(BeneficiaryBase):
    pass

class BeneficiaryInDBBase(BeneficiaryBase):
    id: str
    policy_id: str
    model_config = ConfigDict(from_attributes=True)

class Beneficiary(BeneficiaryInDBBase):
    pass

# PolicyChangeRequest
class PolicyChangeRequestBase(BaseModel):
    request_type: str
    status: str
    submission_date: date

class PolicyChangeRequestCreate(PolicyChangeRequestBase):
    policy_id: str

class PolicyChangeRequestUpdate(BaseModel):
    status: Optional[str] = None

class PolicyChangeRequestInDBBase(PolicyChangeRequestBase):
    id: str
    policy_id: str
    model_config = ConfigDict(from_attributes=True)

class PolicyChangeRequest(PolicyChangeRequestInDBBase):
    pass
