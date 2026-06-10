from pydantic import BaseModel, Field
from typing import Optional

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

class CalculateRequest(BaseModel):
    bill_amount: float = Field(..., ge=0, description="The total bill amount before tip")
    tip_percentage: float = Field(..., ge=0, description="The tip percentage to apply")
    number_of_people: int = Field(..., ge=1, description="The number of people to split the bill among")

class CalculateResponse(BaseModel):
    tip_amount: float
    total_bill: float
    amount_per_person: float
