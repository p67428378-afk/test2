from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import List, Dict, Any


# --- EXISTING PASSWORD RESET SCHEMAS ---
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


# --- NEW APPOINTMENT BOOKING SCHEMAS ---
class DoctorBase(BaseModel):
    name: str
    specialty: str


class DoctorCreate(DoctorBase):
    pass


class DoctorResponse(DoctorBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PatientBase(BaseModel):
    name: str
    contact_info: Dict[str, Any] = {}


class PatientCreate(PatientBase):
    pass


class PatientResponse(PatientBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AppointmentCreate(BaseModel):
    doctorId: UUID = Field(..., alias="doctorId")
    patientId: UUID = Field(..., alias="patientId")
    startTime: datetime = Field(..., alias="startTime")

    class Config:
        populate_by_name = True


class AppointmentResponse(BaseModel):
    id: UUID
    doctorId: UUID = Field(..., alias="doctor_id")
    patientId: UUID = Field(..., alias="patient_id")
    startTime: datetime = Field(..., alias="start_time")
    endTime: datetime = Field(..., alias="end_time")
    status: str

    class Config:
        from_attributes = True
        populate_by_name = True


class PatientAppointmentResponse(BaseModel):
    id: UUID
    doctorName: str
    startTime: datetime = Field(..., alias="start_time")
    endTime: datetime = Field(..., alias="end_time")
    status: str

    class Config:
        from_attributes = True
        populate_by_name = True


class AvailabilityResponse(BaseModel):
    doctorId: UUID
    slots: List[datetime]
