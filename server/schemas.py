from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
import re

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

# Contact Management Schemas
class ContactBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    phone_number: str = Field(..., min_length=1, max_length=50)
    email: EmailStr

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, v: str) -> str:
        pattern = r"^\d{3}-\d{3}-\d{4}$"
        if not re.match(pattern, v):
            raise ValueError("Phone number must follow the format XXX-XXX-XXXX")
        return v

class ContactCreate(ContactBase):
    pass

class ContactResponse(ContactBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
