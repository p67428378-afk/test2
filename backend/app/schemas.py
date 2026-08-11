from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

# Address Schemas
class AddressBase(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str
    country: str

class AddressCreate(AddressBase):
    pass

# Personal Info Schemas
class PersonalInfoBase(BaseModel):
    date_of_birth: str
    social_security_number: str  # In a real app, this would be handled securely (e.g., tokenized)
    employment_status: str
    employer: Optional[str] = None
    occupation: Optional[str] = None

class PersonalInfoCreate(PersonalInfoBase):
    pass

# Financial Info Schemas
class FinancialInfoBase(BaseModel):
    annual_income: float
    source_of_income: str
    other_income: Optional[float] = None
    expenses: Optional[float] = None

class FinancialInfoCreate(FinancialInfoBase):
    pass

# CreditCardProduct Schemas
class CreditCardProductBase(BaseModel):
    name: str
    description: str
    apr: float
    annual_charges: float
    credit_limit_min: float
    credit_limit_max: float
    rewards_description: str
    is_active: bool = True

class CreditCardProductCreate(CreditCardProductBase):
    pass

class CreditCardProductUpdate(CreditCardProductBase):
    name: Optional[str] = None
    description: Optional[str] = None
    apr: Optional[float] = None
    annual_charges: Optional[float] = None
    credit_limit_min: Optional[float] = None
    credit_limit_max: Optional[float] = None
    rewards_description: Optional[str] = None
    is_active: Optional[bool] = None

class CreditCardProductResponse(CreditCardProductBase):
    product_id: str
    last_updated: datetime

    model_config = ConfigDict(from_attributes=True)

# Applicant Schemas
class ApplicantBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    address: AddressCreate

class ApplicantCreate(ApplicantBase):
    authentication_credentials: str # Hashed password

class ApplicantResponse(ApplicantBase):
    user_id: str
    address: Dict[str, Any] # Changed to Dict[str, Any]

    model_config = ConfigDict(from_attributes=True)

# CreditCardApplication Schemas
class CreditCardApplicationBase(BaseModel):
    user_id: str
    product_id: str
    personal_info: PersonalInfoCreate
    financial_info: FinancialInfoCreate
    status: str = "Pending Review"
    comments: Optional[Dict[str, Any]] = None

class CreditCardApplicationCreate(CreditCardApplicationBase):
    pass

class CreditCardApplicationUpdate(BaseModel):
    status: Optional[str] = None
    comments: Optional[Dict[str, Any]] = None

class CreditCardApplicationResponse(CreditCardApplicationBase):
    application_id: str
    submission_date: datetime
    last_updated_date: datetime
    personal_info: Dict[str, Any] # Changed to Dict[str, Any]
    financial_info: Dict[str, Any] # Changed to Dict[str, Any]

    model_config = ConfigDict(from_attributes=True)
