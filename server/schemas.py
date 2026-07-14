from pydantic import BaseModel
from typing import List, Optional, Dict, Any
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


# Claims schemas
class DamageBreakdownItem(BaseModel):
    part: str
    cost: float


class EstimateResponse(BaseModel):
    total_cost: float
    currency: str
    breakdown: List[DamageBreakdownItem]


class ClaimUploadResponse(BaseModel):
    claim_id: UUID


class ClaimEstimateResponse(BaseModel):
    status: str
    estimate: Optional[EstimateResponse] = None
    reason: Optional[str] = None


# Dispatch schemas
class TowTruck(BaseModel):
    driver_name: str
    license_plate: str
    phone_number: str
    latitude: float
    longitude: float


class DispatchRequest(BaseModel):
    claim_id: UUID
    gps_latitude: float
    gps_longitude: float


class DispatchResponse(BaseModel):
    dispatch_id: UUID
    status: str
    eta: str
    tow_truck: TowTruck


class DispatchStatusResponse(BaseModel):
    dispatch_id: UUID
    status: str
    resolved_address: str
    tow_truck: TowTruck


class DispatchCancelResponse(BaseModel):
    status: str
    message: str


# Active Incident schema
class ActiveIncidentResponse(BaseModel):
    isActiveIncident: bool
    claim: Optional[Dict[str, Any]] = None
    dispatch: Optional[Dict[str, Any]] = None
