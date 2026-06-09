from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

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

# New Calculator Schemas
class OperatorEnum(str, Enum):
    add = "add"
    subtract = "subtract"
    multiply = "multiply"
    divide = "divide"

class CalculationCreate(BaseModel):
    operand1: float
    operand2: float
    operator: OperatorEnum

class CalculationResponse(BaseModel):
    id: str
    operand1: float
    operand2: float
    operator: str
    result: Optional[float] = None
    formula: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
