from pydantic import BaseModel
from typing import List, Optional
import uuid
import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    password: str

class UserInDB(User):
    hashed_password: str

class Applicant(BaseModel):
    name: str
    contact_info: Optional[str] = None
    financial_history_ref: Optional[str] = None
    credit_score_ref: Optional[str] = None
    document_ref: Optional[str] = None

    class Config:
        orm_mode = True

class LoanApplicationBase(BaseModel):
    id: uuid.UUID
    applicant_name: str
    application_date: datetime.datetime
    ease_of_approval_score: float
    loan_amount: float
    status: str
    suggested_action: str

class LoanApplication(LoanApplicationBase):
    class Config:
        orm_mode = True

class LoanApplicationDetails(BaseModel):
    id: uuid.UUID
    applicant: Applicant
    justification: str
    suggested_action: str

    class Config:
        orm_mode = True

class Status(BaseModel):
    status: str
