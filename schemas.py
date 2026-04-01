from datetime import date
from typing import List, Optional
from pydantic import BaseModel, Field

class CoverageOptionBase(BaseModel):
    option_name: str
    status: str = "Active"
    cost_impact: float

class CoverageOptionCreate(CoverageOptionBase):
    pass

class CoverageOption(CoverageOptionBase):
    id: str
    policy_id: str

    model_config = {"from_attributes": True}

class BeneficiaryBase(BaseModel):
    name: str
    relationship_to_policyholder: str
    date_of_birth: date

class BeneficiaryCreate(BeneficiaryBase):
    pass

class Beneficiary(BeneficiaryBase):
    id: str
    policy_id: str

    model_config = {"from_attributes": True}

class PolicyBase(BaseModel):
    policy_number: str
    policyholder_id: str
    coverage_type: str
    effective_date: date
    expiration_date: date
    premium_amount: float
    status: str = "Active"
    last_updated_date: Optional[date] = None
    created_date: Optional[date] = None

class PolicyCreate(PolicyBase):
    coverage_options: List[CoverageOptionCreate] = []
    beneficiaries: List[BeneficiaryCreate] = []

class PolicyUpdate(BaseModel):
    coverage_type: Optional[str] = None
    effective_date: Optional[date] = None
    expiration_date: Optional[date] = None
    premium_amount: Optional[float] = None
    status: Optional[str] = None
    last_updated_date: Optional[date] = Field(default_factory=date.today)
    coverage_options: Optional[List[CoverageOptionCreate]] = None
    beneficiaries: Optional[List[BeneficiaryCreate]] = None

class Policy(PolicyBase):
    id: str
    coverage_options: List[CoverageOption] = []
    beneficiaries: List[Beneficiary] = []

    model_config = {"from_attributes": True}
