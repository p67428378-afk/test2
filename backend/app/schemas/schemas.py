from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional

# Credit Card Product Schemas
class CreditCardProductBase(BaseModel):
    name: str = Field(..., example="Platinum Rewards Card")
    description: str = Field(..., example="Earn points on every purchase.")
    features: str = Field(..., example="1.5x points on all spending, no annual fee for the first year.")
    eligibility_criteria: str = Field(..., example="Minimum credit score of 700, annual income of $50,000.")

class CreditCardProductCreate(CreditCardProductBase):
    pass

class CreditCardProduct(CreditCardProductBase):
    id: str

    class Config:
        from_attributes = True

# Applicant Schemas
class ApplicantBase(BaseModel):
    full_name: str = Field(..., example="John Doe")
    address: str = Field(..., example="123 Main St, Anytown, USA, 12345")
    phone_number: str = Field(..., example="555-123-4567")
    email_address: EmailStr = Field(..., example="john.doe@example.com")

class ApplicantCreate(ApplicantBase):
    pass

class Applicant(ApplicantBase):
    id: str

    class Config:
        from_attributes = True

# Financial Information Schemas
class FinancialInformationBase(BaseModel):
    account_statement_reference: Optional[str] = Field(None, example="https://storage.googleapis.com/my-bucket/statement.pdf")
    credit_score: int = Field(..., example=750)
    annual_income: int = Field(..., example=75000)

class FinancialInformationCreate(FinancialInformationBase):
    pass

class FinancialInformation(FinancialInformationBase):
    id: str
    application_id: str

    class Config:
        from_attributes = True

# Employment Information Schemas
class EmploymentInformationBase(BaseModel):
    employer_name: str = Field(..., example="Acme Corp")
    employer_address: str = Field(..., example="456 Business Ave, Cityville, USA, 67890")
    job_title: str = Field(..., example="Software Engineer")
    employment_start_date: date = Field(..., example="2020-01-15")

class EmploymentInformationCreate(EmploymentInformationBase):
    pass

class EmploymentInformation(EmploymentInformationBase):
    id: str
    application_id: str

    class Config:
        from_attributes = True

# Application Schemas
class ApplicationBase(BaseModel):
    applicant_id: str
    credit_card_product_id: str
    status: str = Field("Pending", example="Pending")
    submission_date: date = Field(..., example="2024-04-23")

class ApplicationCreate(ApplicationBase):
    financial_info: FinancialInformationCreate
    employment_info: EmploymentInformationCreate

class Application(ApplicationBase):
    id: str
    reference_number: str
    applicant: Applicant
    credit_card_product: CreditCardProduct
    financial_info: FinancialInformation
    employment_info: EmploymentInformation

    class Config:
        from_attributes = True
