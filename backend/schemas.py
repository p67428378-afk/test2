from datetime import date
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool

    class Config:
        from_attributes = True

class ApplicantBase(BaseModel):
    full_name: str
    phone_number: str
    email: EmailStr
    credit_score: int
    annual_income: float
    mailing_address: str
    employer_name: str
    job_title: str
    employment_start_date: date
    employer_address: str

class ApplicantCreate(ApplicantBase):
    user_id: str

class ApplicantUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    credit_score: Optional[int] = None
    annual_income: Optional[float] = None
    mailing_address: Optional[str] = None
    employer_name: Optional[str] = None
    job_title: Optional[str] = None
    employment_start_date: Optional[date] = None
    employer_address: Optional[str] = None

class ApplicantResponse(ApplicantBase):
    id: str
    user_id: str
    # applications: List["ApplicationResponse"] = [] # Removed to break recursion

    class Config:
        from_attributes = True

class CreditCardBase(BaseModel):
    name: str
    description: str
    apr: float
    cashback_rate: float
    annual_fee: float
    features: str
    credit_limit: float

class CreditCardCreate(CreditCardBase):
    pass

class CreditCardResponse(CreditCardBase):
    id: str
    # applications: List["ApplicationResponse"] = [] # Removed to break recursion

    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    applicant_id: str
    credit_card_id: str
    status: str
    submission_date: date
    last_updated_date: date
    denial_reason: Optional[str] = None

class ApplicationCreate(BaseModel):
    applicant_id: str
    credit_card_id: str

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    denial_reason: Optional[str] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    credit_score: Optional[int] = None
    annual_income: Optional[float] = None
    mailing_address: Optional[str] = None
    employer_name: Optional[str] = None
    job_title: Optional[str] = None
    employment_start_date: Optional[date] = None
    employer_address: Optional[str] = None

class ApplicationResponse(ApplicationBase):
    id: str
    # applicant: "ApplicantResponse" = None # Removed to break recursion
    # credit_card: "CreditCardResponse" = None # Removed to break recursion

    class Config:
        from_attributes = True

# Update forward refs
# ApplicantResponse.model_rebuild()
# CreditCardResponse.model_rebuild()
# ApplicationResponse.model_rebuild()
