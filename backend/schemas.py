from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import date

# Document Schemas
class DocumentBase(BaseModel):
    document_type: str
    file_name: str

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: str
    application_id: str
    storage_path: str
    upload_date: date

    class Config:
        from_attributes = True

# Application Schemas
class ApplicationBase(BaseModel):
    card_id: str
    submission_date: date
    status: str

class ApplicationCreate(ApplicationBase):
    pass

class Application(ApplicationBase):
    id: str
    applicant_id: str
    documents: List[Document] = []

    class Config:
        from_attributes = True

# Applicant Schemas
class ApplicantBase(BaseModel):
    full_name: str
    address: Any
    phone_number: str
    email_address: str
    credit_score: int
    annual_income: float
    employer_name: str
    employer_address: Any
    job_title: str
    employment_start_date: date

class ApplicantCreate(ApplicantBase):
    pass

class Applicant(ApplicantBase):
    id: str
    applications: List[Application] = []

    class Config:
        from_attributes = True

# Credit Card Schemas
class CreditCardBase(BaseModel):
    name: str
    features: List[str]
    benefits: List[str]
    eligibility_criteria: Any
    apr: float
    annual_fee: float
    issuer: str
    image_url: str

class CreditCardCreate(CreditCardBase):
    pass

class CreditCard(CreditCardBase):
    id: str

    class Config:
        from_attributes = True
