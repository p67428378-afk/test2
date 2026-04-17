
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import date
from ..models.policy import PolicyStatus, RequestType, RequestStatus

# Beneficiary
class BeneficiaryBase(BaseModel):
    name: str
    beneficiary_relationship: str
    contact_info: str

class BeneficiaryCreate(BeneficiaryBase):
    pass

class Beneficiary(BeneficiaryBase):
    id: int
    policy_id: int

    model_config = ConfigDict(from_attributes=True)

# CoverageDetails
class CoverageDetailsBase(BaseModel):
    type: str
    limits: str
    deductibles: str

class CoverageDetailsCreate(CoverageDetailsBase):
    pass

class CoverageDetails(CoverageDetailsBase):
    id: int
    policy_id: int

    model_config = ConfigDict(from_attributes=True)

# PolicyChangeRequest
class PolicyChangeRequestBase(BaseModel):
    request_type: RequestType
    submission_date: date

class PolicyChangeRequestCreate(PolicyChangeRequestBase):
    pass

class PolicyChangeRequestUpdate(BaseModel):
    status: Optional[RequestStatus] = None
    approval_date: Optional[date] = None

class PolicyChangeRequest(PolicyChangeRequestBase):
    id: int
    policy_id: int
    status: RequestStatus
    approval_date: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)

# Policy
class PolicyBase(BaseModel):
    policy_number: str
    plan_type: str
    premium_amount: float
    effective_date: date
    expiration_date: date
    status: PolicyStatus

class PolicyCreate(PolicyBase):
    pass

class PolicyUpdate(BaseModel):
    plan_type: Optional[str] = None
    premium_amount: Optional[float] = None
    effective_date: Optional[date] = None
    expiration_date: Optional[date] = None
    status: Optional[PolicyStatus] = None

class Policy(PolicyBase):
    id: int
    policy_holder_id: int
    coverage_details: List[CoverageDetails] = []
    beneficiaries: List[Beneficiary] = []
    change_requests: List[PolicyChangeRequest] = []

    model_config = ConfigDict(from_attributes=True)

# PolicyHolder
class PolicyHolderBase(BaseModel):
    name: str
    address: str
    contact_info: str

class PolicyHolderCreate(PolicyHolderBase):
    authentication_details: str

class PolicyHolderUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    contact_info: Optional[str] = None

class PolicyHolder(PolicyHolderBase):
    id: int
    policies: List[Policy] = []

    model_config = ConfigDict(from_attributes=True)
