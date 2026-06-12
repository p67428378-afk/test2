from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

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

# Trail Schemas
class TrailBase(BaseModel):
    name: str
    status: Optional[str] = "Open"

class TrailCreate(TrailBase):
    pass

class TrailResponse(BaseModel):
    id: UUID
    name: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Trail Report Schemas
class TrailReportCreate(BaseModel):
    trail_id: UUID
    user_id: UUID
    condition: str
    notes: Optional[str] = None
    media_url: Optional[str] = None

class TrailReportResponse(BaseModel):
    id: UUID
    trail_id: UUID
    user_id: UUID
    condition: str
    notes: Optional[str] = None
    media_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TrailReportDetailResponse(BaseModel):
    id: UUID
    trail_id: UUID
    trail_name: str
    user_id: UUID
    reported_by: str
    condition: str
    notes: Optional[str] = None
    media_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Wildlife Sighting Schemas
class WildlifeSightingCreate(BaseModel):
    user_id: UUID
    species: str
    count: int
    location: str
    notes: Optional[str] = None

class WildlifeSightingResponse(BaseModel):
    id: UUID
    user_id: UUID
    species: str
    count: int
    location: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class WildlifeSightingDetailResponse(BaseModel):
    id: UUID
    user_id: UUID
    logged_by: str
    species: str
    count: int
    location: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Access Rule Schemas
class AccessRuleCreate(BaseModel):
    trail_id: UUID
    is_closed: bool
    reason: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class AccessRuleResponse(BaseModel):
    id: UUID
    trail_id: UUID
    is_closed: bool
    reason: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AccessRuleDetailResponse(BaseModel):
    id: UUID
    trail_id: UUID
    trail_name: str
    is_closed: bool
    reason: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
