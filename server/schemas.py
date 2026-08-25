from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(..., pattern="^(employer|job_seeker)$")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class JobCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    description: str = Field(..., min_length=10)
    requirements: str = Field(..., min_length=10)
    salary_range: Optional[str] = None
    location: str = Field(..., min_length=2, max_length=255)
    job_type: str = Field(..., pattern="^(full-time|part-time|contract)$")


class JobUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, min_length=10)
    requirements: Optional[str] = Field(None, min_length=10)
    salary_range: Optional[str] = None
    location: Optional[str] = Field(None, min_length=2, max_length=255)
    job_type: Optional[str] = Field(None, pattern="^(full-time|part-time|contract)$")
    is_active: Optional[bool] = None


class JobResponse(BaseModel):
    id: str
    employer_id: str
    title: str
    description: str
    requirements: str
    salary_range: Optional[str]
    location: str
    job_type: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class JobListResponse(BaseModel):
    total: int
    skip: int
    limit: int
    items: List[JobResponse]


class ApplicationResponse(BaseModel):
    id: str
    job_id: str
    job_seeker_id: str
    cover_letter: Optional[str]
    resume_url: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ApplicationStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(Applied|Reviewed|Interviewing|Rejected)$")


class ApplicationWithSeekerResponse(BaseModel):
    id: str
    job_id: str
    job_seeker_id: str
    cover_letter: Optional[str]
    resume_url: str
    status: str
    created_at: datetime
    updated_at: datetime
    job_seeker: UserResponse

    class Config:
        from_attributes = True
