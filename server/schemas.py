from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# User Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: str = Field(
        default="Patient", description="Admin, Doctor, Nurse, Receptionist, Patient"
    )


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Patient Schemas
class PatientCreate(BaseModel):
    ssn_gov_id: str
    first_name: str
    last_name: str
    dob: date
    gender: str
    phone: str
    emergency_contact: str
    medical_history: Optional[str] = None


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_history: Optional[str] = None


class PatientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    ssn_gov_id: str
    first_name: str
    last_name: str
    dob: date
    gender: str
    phone: str
    emergency_contact: str
    medical_history: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# Doctor Schedule Schemas
class DoctorScheduleCreate(BaseModel):
    doctor_id: str
    day_of_week: str
    start_time: str
    end_time: str
    slot_duration_minutes: int = 30


class DoctorScheduleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    doctor_id: str
    day_of_week: str
    start_time: str
    end_time: str
    slot_duration_minutes: int


# Appointment Schemas
class AppointmentCreate(BaseModel):
    patient_id: str
    doctor_id: str
    appointment_time: datetime
    notes: Optional[str] = None


class AppointmentUpdateStatus(BaseModel):
    status: str  # SCHEDULED, CONFIRMED, COMPLETED, CANCELLED


class AppointmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    doctor_id: str
    appointment_time: datetime
    status: str
    notes: Optional[str] = None
    created_at: datetime


# Prescription Schemas
class PrescriptionCreate(BaseModel):
    medical_record_id: str
    medication_name: str
    dosage: str
    instructions: Optional[str] = None


class PrescriptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    medical_record_id: str
    medication_name: str
    dosage: str
    instructions: Optional[str] = None
    created_at: datetime


# Medical Record Schemas
class MedicalRecordCreate(BaseModel):
    patient_id: str
    doctor_id: str
    appointment_id: str
    diagnosis: str
    notes: Optional[str] = None


class MedicalRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    doctor_id: str
    appointment_id: str
    diagnosis: str
    notes: Optional[str] = None
    created_at: datetime
    prescriptions: List[PrescriptionResponse] = []


# Invoice Schemas
class InvoiceCreate(BaseModel):
    appointment_id: str
    patient_id: str
    amount: float
    itemized_details: Optional[List[Any]] = None


class InvoiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    appointment_id: str
    patient_id: str
    amount: float
    status: str
    itemized_details: Optional[List[Any]] = None
    created_at: datetime
    updated_at: datetime
