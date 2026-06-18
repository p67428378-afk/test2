"""
Module: server/schemas.py
Purpose: Pydantic schemas for Global Treasury Sweeping Rule Management
"""

from pydantic import BaseModel, ConfigDict
from typing import List
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


# New Sweeping Rule Schemas
class SweepRuleBase(BaseModel):
    name: str
    source_accounts: List[str]
    target_account: str
    threshold: float
    frequency: str
    fx_strategy: str


class SweepRuleCreate(SweepRuleBase):
    pass


class SweepRuleUpdate(SweepRuleBase):
    pass


class SweepRuleResponse(SweepRuleBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WorkflowDetailsResponse(BaseModel):
    rule_id: str
    name: str
    source_accounts: List[str]
    target_account: str
    threshold: float
    amount: float
    fx_rate: float
    hedging_strategy: str
    local_limit_compliant: bool
    rate_lock_seconds: int
    status: str

    model_config = ConfigDict(from_attributes=True)


class WorkflowPauseResponse(BaseModel):
    rule_id: str
    status: str


class WorkflowApproveResponse(BaseModel):
    rule_id: str
    execution_id: str
    status: str


class WorkflowRejectResponse(BaseModel):
    rule_id: str
    status: str


class WorkflowAdjustRequest(BaseModel):
    fx_strategy: str
    threshold: float


class WorkflowAdjustResponse(BaseModel):
    rule_id: str
    fx_strategy: str
    threshold: float
    status: str
