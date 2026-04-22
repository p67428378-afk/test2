from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class EmploymentBase(BaseModel):
    employer_name: str
    employer_address: str
    job_title: str
    employment_start_date: date

class EmploymentCreate(EmploymentBase):
    pass

class Employment(EmploymentBase):
    id: str
    applicant_id: str

    class Config:
        from_attributes = True

class ApplicantBase(BaseModel):
    name: str
    address: str
    phone: str
    email: str
    credit_score: float
    annual_income: float

class ApplicantCreate(ApplicantBase):
    employment: EmploymentCreate

class Applicant(ApplicantBase):
    id: str
    employment: List[Employment] = []

    class Config:
        from_attributes = True

class CreditCardOfferBase(BaseModel):
    card_name: str
    features: str
    benefits: str
    eligibility_criteria: str

class CreditCardOfferCreate(CreditCardOfferBase):
    pass

class CreditCardOffer(CreditCardOfferBase):
    id: str

    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    submission_date: date
    status: str = "Pending"

class ApplicationCreate(ApplicationBase):
    applicant: ApplicantCreate
    offer_id: str

class Application(ApplicationBase):
    id: str
    applicant: Applicant
    offer: CreditCardOffer

    class Config:
        from_attributes = True
