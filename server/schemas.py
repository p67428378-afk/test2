from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "owner"  # owner, vet, admin


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime


# Pet Schemas
class PetCreate(BaseModel):
    name: str
    species: str
    breed: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    gender: Optional[str] = None
    microchip_number: Optional[str] = None
    owner_id: Optional[str] = None


class PetUpdate(BaseModel):
    name: Optional[str] = None
    species: Optional[str] = None
    breed: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    gender: Optional[str] = None
    microchip_number: Optional[str] = None


class PetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    owner_id: str
    name: str
    species: str
    breed: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    gender: Optional[str] = None
    microchip_number: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# Appointment Schemas
class AppointmentCreate(BaseModel):
    pet_id: str
    vet_id: Optional[str] = None
    appointment_date: datetime
    reason: str
    notes: Optional[str] = None


class AppointmentStatusUpdate(BaseModel):
    status: str  # SCHEDULED, COMPLETED, CANCELLED
    notes: Optional[str] = None


class AppointmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pet_id: str
    vet_id: Optional[str] = None
    appointment_date: datetime
    reason: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# Medical Record Schemas
class MedicalRecordCreate(BaseModel):
    pet_id: str
    appointment_id: Optional[str] = None
    vet_id: Optional[str] = None
    visit_date: Optional[datetime] = None
    diagnosis: Optional[str] = None
    treatment: Optional[str] = None
    prescriptions: Optional[str] = None
    notes: Optional[str] = None


class MedicalRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pet_id: str
    appointment_id: Optional[str] = None
    vet_id: Optional[str] = None
    visit_date: datetime
    diagnosis: Optional[str] = None
    treatment: Optional[str] = None
    prescriptions: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# Vaccination Schemas
class VaccinationCreate(BaseModel):
    pet_id: str
    vaccine_name: str
    administered_date: Optional[datetime] = None
    next_due_date: Optional[datetime] = None
    vet_id: Optional[str] = None
    status: Optional[str] = "UP_TO_DATE"


class VaccinationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pet_id: str
    vaccine_name: str
    administered_date: datetime
    next_due_date: Optional[datetime] = None
    vet_id: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime


# Reminder Schemas
class ReminderCreate(BaseModel):
    pet_id: str
    vaccination_id: Optional[str] = None
    reminder_type: Optional[str] = "VACCINATION"
    status: Optional[str] = "PENDING"
    scheduled_date: datetime


class ReminderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    pet_id: str
    vaccination_id: Optional[str] = None
    reminder_type: str
    status: str
    scheduled_date: datetime
    sent_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class ReminderProcessResponse(BaseModel):
    processed_count: int
    reminders: List[ReminderResponse]
