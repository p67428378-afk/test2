from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID

# Existing Password Reset Schemas
class PasswordResetInitiateRequest(BaseModel):
    login_id: str
    mobile_number: str

class PasswordResetInitiateResponse(BaseModel):
    otp_session_id: str
    security_question: str

class OTPVerifyRequest(BaseModel):
    otp_code: str
    otp_session_id: str

class OTPVerifyResponse(BaseModel):
    security_question_session_id: str

class SecurityQuestionVerifyRequest(BaseModel):
    answer: str
    security_question_session_id: str

class SecurityQuestionVerifyResponse(BaseModel):
    password_reset_session_id: str

class SetNewPasswordRequest(BaseModel):
    new_password: str
    password_reset_session_id: str

class SetNewPasswordResponse(BaseModel):
    status: str
    login_link: str


# New KYC & AML Schemas
class CustomerCreate(BaseModel):
    firstName: str = Field(..., alias="firstName")
    lastName: str = Field(..., alias="lastName")
    email: str
    phone: str
    dateOfBirth: str = Field(..., alias="dateOfBirth") # YYYY-MM-DD
    address: str
    aadhaarNumber: str = Field(..., alias="aadhaarNumber")
    panNumber: str = Field(..., alias="panNumber")

    class Config:
        populate_by_name = True

class CustomerResponse(BaseModel):
    id: UUID
    firstName: str
    lastName: str
    email: str
    phone: str
    dateOfBirth: str
    address: str
    riskScore: float
    status: str
    createdAt: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class CustomerDetailResponse(BaseModel):
    id: UUID
    firstName: str
    lastName: str
    email: str
    phone: str
    dateOfBirth: str
    address: str
    aadhaarNumber: str
    panNumber: str
    riskScore: float
    status: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class AadhaarOTPVerifyRequest(BaseModel):
    otp: str

class AadhaarOTPVerifyResponse(BaseModel):
    status: str
    details: str

class PANVerifyResponse(BaseModel):
    status: str
    details: str

class ScreeningResultResponse(BaseModel):
    watchlist: str
    matchStatus: str
    confidenceScore: float
    reason: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class ScreeningResponse(BaseModel):
    status: str
    results: List[ScreeningResultResponse]

class VerificationCheckResponse(BaseModel):
    checkType: str
    status: str
    details: Optional[str] = None
    createdAt: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class CustomerActionRequest(BaseModel):
    status: str
    notes: str

class CustomerActionResponse(BaseModel):
    id: str
    status: str
    notes: str
    updatedAt: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class TransactionCreate(BaseModel):
    customerId: UUID = Field(..., alias="customerId")
    amount: float
    transactionType: str = Field(..., alias="transactionType")
    destinationAccount: Optional[str] = Field(None, alias="destinationAccount")

    class Config:
        populate_by_name = True

class TransactionResponse(BaseModel):
    id: UUID
    customerId: UUID
    amount: float
    transactionType: str
    status: str
    alertTriggered: bool
    createdAt: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class AlertResponse(BaseModel):
    id: UUID
    customerId: UUID
    customerName: str
    triggeredRule: str
    totalAmount: float
    severity: str
    status: str
    createdAt: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class ReportResponse(BaseModel):
    id: UUID
    customerName: Optional[str] = None
    reportType: str
    status: str
    xmlContent: str
    createdDate: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class ReportSubmitResponse(BaseModel):
    id: UUID
    status: str
    submittedAt: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
