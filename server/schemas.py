"""
Module: server.schemas
Purpose: Pydantic schemas for request and response validation.
Author: Backend Developer Agent
Created: 2026-06-16
"""

from pydantic import BaseModel
from typing import Optional, List

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

class CalendarDayResponse(BaseModel):
    date: str
    day_number: int
    is_current_month: bool
    is_today: bool

class CalendarGridResponse(BaseModel):
    days: List[CalendarDayResponse]
    month: int
    year: int
