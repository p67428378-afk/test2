"""
Module: server/schemas.py
Purpose: Pydantic schemas for password reset and assortment advisor.
Author: Backend Developer Agent
Created: 2026-06-09
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- Password Reset Schemas ---

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

# --- Assortment Advisor Schemas ---

class DashboardResponse(BaseModel):
    sales_per_linear_ft: float
    private_brand_percent: float
    in_stock_rate: float
    shelf_capacity_percent: float

    class Config:
        from_attributes = True

class SKUPerformanceResponse(BaseModel):
    id: str
    sku: str
    product_name: str
    sales: float
    units: int
    profit_margin: float
    days_of_supply: int
    status_badge: str
    is_private_brand: bool

    class Config:
        from_attributes = True

class ScenarioResponse(BaseModel):
    id: str
    name: str
    description: str
    projected_sales_lift: float
    projected_profit_margin: float
    new_private_brand_percent: float
    skus_to_add: int
    skus_to_remove: int
    skus_to_swap: int

    class Config:
        from_attributes = True

class SubmitRequest(BaseModel):
    scenario_id: str
    user_id: str

class SubmitResponse(BaseModel):
    submission_id: str
    selected_scenario: str
    submitted_by: str
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True

class SeedResponse(BaseModel):
    status: str
    message: str
