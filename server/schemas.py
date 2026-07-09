from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
import uuid


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    name: str
    password: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    name: str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


# Pet Schemas
class PetBase(BaseModel):
    name: str
    breed: str
    age: float
    location: str
    status: str = "Available"
    photo_url: Optional[str] = None
    description: Optional[str] = None


class PetCreate(PetBase):
    pass


class PetUpdate(PetBase):
    pass


class PetResponse(PetBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


class PetListResponse(BaseModel):
    items: List[PetResponse]
    total: int
    skip: int
    limit: int


# Application Schemas
class ApplicationCreate(BaseModel):
    pet_id: uuid.UUID
    applicant_name: str
    applicant_email: EmailStr
    applicant_phone: str
    reason: str
    has_other_pets: bool
    visit_date: date
    visit_time: str


class ApplicationResponse(BaseModel):
    id: uuid.UUID
    created_at: datetime
    status: str

    class Config:
        from_attributes = True


class AdminApplicationItem(BaseModel):
    id: uuid.UUID
    applicant_name: str
    pet_name: str
    status: str
    visit_date: date

    class Config:
        from_attributes = True


class AdminApplicationList(BaseModel):
    items: List[AdminApplicationItem]


class ApplicationStatusUpdate(BaseModel):
    status: str


class DeleteResponse(BaseModel):
    success: bool
