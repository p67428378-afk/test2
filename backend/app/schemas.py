from pydantic import BaseModel, EmailStr, ConfigDict # Added ConfigDict
from typing import Optional
from datetime import datetime

class CreditCardProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    apr: float
    annual_charges: float
    credit_limit_min: float
    credit_limit_max: float
    rewards_description: Optional[str] = None
    is_active: Optional[bool] = True

class CreditCardProductCreate(CreditCardProductBase):
    pass

class CreditCardProduct(CreditCardProductBase):
    product_id: str
    last_updated: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True) # Updated from Config

class ApplicantBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    address: Optional[str] = None

class ApplicantCreate(ApplicantBase):
    authentication_credentials: str # This would be a hashed password in a real app

class Applicant(ApplicantBase):
    user_id: str

    model_config = ConfigDict(from_attributes=True) # Updated from Config

class CreditCardApplicationBase(BaseModel):
    user_id: str
    product_id: str
    personal_info: str # This would be a Pydantic model for personal info
    financial_info: str # This would be a Pydantic model for financial info
    status: Optional[str] = "Pending Review"
    comments: Optional[str] = None

class CreditCardApplicationCreate(CreditCardApplicationBase):
    pass

class CreditCardApplication(CreditCardApplicationBase):
    application_id: str
    submission_date: datetime
    last_updated_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True) # Updated from Config
