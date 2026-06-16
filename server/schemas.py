from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

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

class AlphabetBase(BaseModel):
    letter: str
    word: str
    emoji: str

class AlphabetCreate(AlphabetBase):
    pass

class AlphabetResponse(AlphabetBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class NumberBase(BaseModel):
    number: int
    word: str
    emoji: str

class NumberCreate(NumberBase):
    pass

class NumberResponse(NumberBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
