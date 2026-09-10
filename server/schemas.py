from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, EmailStr, ConfigDict


# --- Auth & User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: str


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse] = None


class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None


# --- Resume Schemas ---
class ExperienceItem(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    bullets: Optional[List[str]] = None


class EducationItem(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    grade: Optional[str] = None


class ResumeBase(BaseModel):
    user_name: str
    email: str
    phone: Optional[str] = None
    portfolio_url: Optional[str] = None
    template_id: str = "classic"
    experiences: List[Any] = []
    education: List[Any] = []
    skills: List[Any] = []


class ResumeCreate(ResumeBase):
    user_id: Optional[str] = None


class ResumeUpdate(BaseModel):
    user_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    portfolio_url: Optional[str] = None
    template_id: Optional[str] = None
    experiences: Optional[List[Any]] = None
    education: Optional[List[Any]] = None
    skills: Optional[List[Any]] = None


class ResumeResponse(ResumeBase):
    id: str
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ExportPdfRequest(ResumeBase):
    resume_id: Optional[str] = None


class TemplateInfo(BaseModel):
    id: str
    name: str
    description: str
    preview_color: Optional[str] = None
