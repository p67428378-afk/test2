from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = "owner"


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserOut] = None


class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None
    role: Optional[str] = None


# --- Pet Schemas ---
class PetBase(BaseModel):
    name: str
    species: str
    breed: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    gender: Optional[str] = "male"
    microchip_number: Optional[str] = None


class PetCreate(PetBase):
    owner_id: Optional[str] = None


class PetUpdate(BaseModel):
    name: Optional[str] = None
    species: Optional[str] = None
    breed: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    gender: Optional[str] = None
    microchip_number: Optional[str] = None
    owner_id: Optional[str] = None


class PetOut(PetBase):
    id: str
    owner_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Appointment Schemas ---
class AppointmentBase(BaseModel):
    pet_id: str
    vet_id: Optional[str] = None
    appointment_date: datetime
    reason: str
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    status: Optional[str] = "SCHEDULED"


class AppointmentStatusUpdate(BaseModel):
    status: str


class AppointmentOut(AppointmentBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Medical Record Schemas ---
class MedicalRecordBase(BaseModel):
    pet_id: str
    appointment_id: Optional[str] = None
    vet_id: Optional[str] = None
    diagnosis: Optional[str] = None
    treatment: Optional[str] = None
    prescriptions: Optional[str] = None
    notes: Optional[str] = None


class MedicalRecordCreate(MedicalRecordBase):
    visit_date: Optional[datetime] = None


class MedicalRecordOut(MedicalRecordBase):
    id: str
    visit_date: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Vaccination Schemas ---
class VaccinationBase(BaseModel):
    pet_id: str
    vet_id: Optional[str] = None
    vaccine_name: str
    administered_date: Optional[datetime] = None
    next_due_date: Optional[datetime] = None
    status: Optional[str] = "UP_TO_DATE"


class VaccinationCreate(VaccinationBase):
    pass


class VaccinationOut(VaccinationBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Reminder Schemas ---
class ReminderBase(BaseModel):
    pet_id: str
    vaccination_id: Optional[str] = None
    reminder_type: Optional[str] = "VACCINATION"
    scheduled_date: datetime
    status: Optional[str] = "PENDING"


class ReminderCreate(ReminderBase):
    pass


class ReminderOut(ReminderBase):
    id: str
    sent_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReminderProcessResult(BaseModel):
    message: str
    processed_count: int
