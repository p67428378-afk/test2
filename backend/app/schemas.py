from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import date

class PolicyBase(BaseModel):
    policy_number: str
    plan_type: str
    deductible: float
    co_pay: float
    premium_amount: float
    effective_date: date
    expiration_date: date
    status: str

class PolicyCreate(PolicyBase):
    pass

class PolicyUpdate(PolicyBase):
    policy_number: Optional[str] = None
    plan_type: Optional[str] = None
    deductible: Optional[float] = None
    co_pay: Optional[float] = None
    premium_amount: Optional[float] = None
    effective_date: Optional[date] = None
    expiration_date: Optional[date] = None
    status: Optional[str] = None

class Policy(PolicyBase):
    policy_id: str
    user_id: str

    class Config:
        from_attributes = True

class PolicyHolderBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    address: str

class PolicyHolderCreate(PolicyHolderBase):
    pass

class PolicyHolderUpdate(PolicyHolderBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None

class PolicyHolder(PolicyHolderBase):
    user_id: str
    policies: List[Policy] = []

    class Config:
        from_attributes = True

class BeneficiaryBase(BaseModel):
    name: str
    relationship: str
    date_of_birth: date

class BeneficiaryCreate(BeneficiaryBase):
    pass

class BeneficiaryUpdate(BeneficiaryBase):
    name: Optional[str] = None
    relationship: Optional[str] = None
    date_of_birth: Optional[date] = None

class Beneficiary(BeneficiaryBase):
    beneficiary_id: str
    policy_id: str

    class Config:
        from_attributes = True

class ClaimBase(BaseModel):
    date_of_service: date
    provider: str
    amount: float
    status: str

class ClaimCreate(ClaimBase):
    pass

class ClaimUpdate(ClaimBase):
    date_of_service: Optional[date] = None
    provider: Optional[str] = None
    amount: Optional[float] = None
    status: Optional[str] = None

class Claim(ClaimBase):
    claim_id: str
    policy_id: str

    class Config:
        from_attributes = True

class PaymentMethodBase(BaseModel):
    type: str
    details: str
    last_four_digits: str
    expiration_date: date

class PaymentMethodCreate(PaymentMethodBase):
    pass

class PaymentMethodUpdate(PaymentMethodBase):
    type: Optional[str] = None
    details: Optional[str] = None
    last_four_digits: Optional[str] = None
    expiration_date: Optional[date] = None

class PaymentMethod(PaymentMethodBase):
    payment_method_id: str
    user_id: str

    class Config:
        from_attributes = True
