from typing import Optional, List, Dict, Any, Literal
from datetime import datetime, date
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# User & Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: Literal["Admin", "Doctor", "Staff", "Patient"] = "Patient"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Patient Schemas
class PatientCreate(BaseModel):
    user_id: Optional[str] = None
    full_name: str = Field(..., min_length=1)
    date_of_birth: date
    gender: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=3)
    emergency_contact: str = Field(..., min_length=1)
    medical_history: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_policy_number: Optional[str] = None


class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_history: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_policy_number: Optional[str] = None


class PatientResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    full_name: str
    date_of_birth: date
    gender: str
    phone: str
    emergency_contact: str
    medical_history: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_policy_number: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Doctor Slot Schemas
class DoctorSlotCreate(BaseModel):
    doctor_id: str
    department: str
    start_time: datetime
    end_time: datetime


class DoctorSlotResponse(BaseModel):
    id: str
    doctor_id: str
    department: str
    start_time: datetime
    end_time: datetime
    is_booked: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Appointment Schemas
class AppointmentCreate(BaseModel):
    patient_id: str
    doctor_id: str
    slot_id: str
    reason_for_visit: Optional[str] = None


class AppointmentStatusUpdate(BaseModel):
    status: Literal["Scheduled", "In-Progress", "Completed", "Cancelled"]


class AppointmentResponse(BaseModel):
    id: str
    patient_id: str
    doctor_id: str
    slot_id: str
    status: str
    reason_for_visit: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# EMR Schemas
class EMRRecordCreate(BaseModel):
    appointment_id: str
    patient_id: str
    doctor_id: str
    diagnosis: str
    clinical_notes: str
    prescriptions: List[Dict[str, Any]] = Field(default_factory=list)
    lab_orders: List[Dict[str, Any]] = Field(default_factory=list)


class EMRRecordResponse(BaseModel):
    id: str
    appointment_id: str
    patient_id: str
    doctor_id: str
    diagnosis: str
    clinical_notes: str
    prescriptions: List[Dict[str, Any]] = Field(default_factory=list)
    lab_orders: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Invoice Schemas
class InvoiceCreate(BaseModel):
    appointment_id: str
    patient_id: str
    total_amount: float
    line_items: List[Dict[str, Any]] = Field(default_factory=list)
    payment_status: Literal["Pending", "Paid", "Refunded"] = "Pending"


class InvoicePaymentUpdate(BaseModel):
    payment_status: Literal["Pending", "Paid", "Refunded"]


class InvoiceResponse(BaseModel):
    id: str
    appointment_id: str
    patient_id: str
    total_amount: float
    line_items: List[Dict[str, Any]] = Field(default_factory=list)
    payment_status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
