from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID

# Keep existing schemas for backward compatibility
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


# Wildlife Conservation System Schemas
class AnimalBase(BaseModel):
    name: str
    species: str
    gps_tag_id: str

class AnimalCreate(AnimalBase):
    pass

class AnimalResponse(AnimalBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GPSLocationBase(BaseModel):
    latitude: float
    longitude: float
    timestamp: datetime

class GPSLocationCreate(GPSLocationBase):
    animal_id: UUID

class GPSLocationResponse(GPSLocationBase):
    id: UUID
    animal_id: UUID

    class Config:
        from_attributes = True

class AnimalLocationResponse(BaseModel):
    id: UUID
    name: str
    species: str
    gps_tag_id: str
    latitude: float
    longitude: float
    timestamp: datetime

    class Config:
        from_attributes = True

class HealthExaminationBase(BaseModel):
    examination_date: date
    veterinarian: str
    health_status: str
    notes: Optional[str] = None

class HealthExaminationCreate(HealthExaminationBase):
    animal_id: UUID

class HealthExaminationResponse(HealthExaminationBase):
    id: UUID
    animal_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ProtectedZoneBase(BaseModel):
    name: str
    area: str # JSON string representing coordinates/polygon

class ProtectedZoneCreate(ProtectedZoneBase):
    pass

class ProtectedZoneResponse(ProtectedZoneBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
