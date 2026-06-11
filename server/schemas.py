from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
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


# New Banking Module Schemas

class UserLoginRequest(BaseModel):
    login_id: str
    password: str

class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: UUID

class AccountResponse(BaseModel):
    id: UUID
    user_id: UUID
    account_number: str
    account_type: str
    balance: float
    created_at: datetime

    class Config:
        from_attributes = True

class InternalTransferRequest(BaseModel):
    from_account_id: UUID
    to_account_id: UUID
    amount: float = Field(..., gt=0)
    memo: Optional[str] = None

class InternalTransferResponse(BaseModel):
    transaction_id: UUID
    from_account_id: UUID
    to_account_id: UUID
    amount: float
    type: str
    memo: Optional[str]
    new_from_balance: float
    new_to_balance: float
    created_at: datetime

class P2PTransferRequest(BaseModel):
    from_account_id: UUID
    recipient_account_number: str
    amount: float = Field(..., gt=0)
    password: str
    memo: Optional[str] = None

class P2PTransferResponse(BaseModel):
    transaction_id: UUID
    from_account_id: UUID
    to_account_id: UUID
    amount: float
    type: str
    memo: Optional[str]
    new_from_balance: float
    created_at: datetime

class TransactionItem(BaseModel):
    id: UUID
    from_account_id: Optional[UUID] = None
    from_account_number: Optional[str] = None
    to_account_id: UUID
    to_account_number: str
    amount: float
    type: str
    direction: str  # "Incoming" or "Outgoing"
    memo: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TransactionListResponse(BaseModel):
    items: List[TransactionItem]
    total: int
    skip: int
    limit: int
