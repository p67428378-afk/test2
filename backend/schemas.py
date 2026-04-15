
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator
from typing import List, Optional
from datetime import date

# CreditCardOffering Schemas
class CreditCardOfferingBase(BaseModel):
    name: str
    description: str
    features: List[str]
    benefits: List[str]
    eligibility_criteria: str

class CreditCardOfferingCreate(CreditCardOfferingBase):
    pass

class CreditCardOffering(CreditCardOfferingBase):
    id: str
    model_config = ConfigDict(from_attributes=True)

# Applicant Schemas
class ApplicantBase(BaseModel):
    first_name: str
    last_name: str
    address_line_1: str
    address_line_2: Optional[str] = None
    city: str
    state: str
    zip_code: str
    phone_number: str
    email_address: EmailStr

class ApplicantCreate(ApplicantBase):
    pass

class Applicant(ApplicantBase):
    id: str
    application_status: str
    model_config = ConfigDict(from_attributes=True)

# FinancialInfo Schemas
class FinancialInfoBase(BaseModel):
    annual_income: float
    credit_score: int

    @field_validator('annual_income')
    def annual_income_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('Annual income must be a positive number')
        return v

class FinancialInfoCreate(FinancialInfoBase):
    pass

class FinancialInfo(FinancialInfoBase):
    id: str
    account_statement_ref: str
    model_config = ConfigDict(from_attributes=True)

# EmploymentInfo Schemas
class EmploymentInfoBase(BaseModel):
    employer_name: str
    employer_address: str
    job_title: str
    employment_start_date: date

class EmploymentInfoCreate(EmploymentInfoBase):
    pass

class EmploymentInfo(EmploymentInfoBase):
    id: str
    model_config = ConfigDict(from_attributes=True)

# Application Schemas
class ApplicationBase(BaseModel):
    credit_card_id: str

class ApplicationCreate(ApplicationBase):
    applicant: ApplicantCreate
    financial_info: FinancialInfoCreate
    employment_info: EmploymentInfoCreate

class Application(ApplicationBase):
    id: str
    applicant: Applicant
    financial_info: FinancialInfo
    employment_info: EmploymentInfo
    submission_date: date
    status: str
    last_updated_date: date
    model_config = ConfigDict(from_attributes=True)
