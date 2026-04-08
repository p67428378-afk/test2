from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional

class ApplicantBase(BaseModel):
    full_name: str
    address: str
    phone_number: str
    email_address: EmailStr
    date_of_birth: date

class ApplicantCreate(ApplicantBase):
    user_id: str # Assuming user_id is provided during creation

class Applicant(ApplicantBase):
    applicant_id: str
    user_id: str

    class Config:
        from_attributes = True

class FinancialInfoBase(BaseModel):
    annual_income: int = Field(..., gt=0)
    credit_score: int = Field(..., ge=300, le=850)
    account_statement_document_id: Optional[str] = None

class FinancialInfoCreate(FinancialInfoBase):
    pass

class FinancialInfo(FinancialInfoBase):
    financial_info_id: str
    application_id: str

    class Config:
        from_attributes = True

class EmploymentInfoBase(BaseModel):
    employer_name: str
    employer_address: str
    job_title: str
    employment_start_date: date

class EmploymentInfoCreate(EmploymentInfoBase):
    pass

class EmploymentInfo(EmploymentInfoBase):
    employment_info_id: str
    application_id: str

    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    applicant_id: str
    credit_card_product_id: str

class ApplicationCreate(ApplicationBase):
    pass

class Application(ApplicationBase):
    application_id: str
    submission_date: date
    status: str
    last_updated: date
    applicant: Applicant
    financial_info: Optional[FinancialInfo] = None
    employment_info: Optional[EmploymentInfo] = None

    class Config:
        from_attributes = True

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    last_updated: Optional[date] = None

