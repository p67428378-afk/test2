from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

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


# New Balance Inquiry & Audit Schemas
class BalanceInquiryResponse(BaseModel):
    accountNumber: str
    availableBalance: float
    currency: str
    ledgerBalance: float
    reasonCode: Optional[str] = None
    remainingLimit: float
    status: str
    timestamp: str

    class Config:
        from_attributes = True

class AuditLogItem(BaseModel):
    accountId: str
    details: Optional[str] = None
    eventType: str
    id: str
    timestamp: str
    userId: str

    class Config:
        from_attributes = True

class AuditLogsResponse(BaseModel):
    logs: List[AuditLogItem]

class TransactionItem(BaseModel):
    accountId: str
    amount: float
    description: str
    id: str
    timestamp: str
    type: str

    class Config:
        from_attributes = True

class TransactionsResponse(BaseModel):
    transactions: List[TransactionItem]
