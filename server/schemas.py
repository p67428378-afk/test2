from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class ExperienceSchema(BaseModel):
    company: str = Field(..., min_length=1, max_length=255, description="Company or Organization name")
    role: str = Field(..., min_length=1, max_length=255, description="Job Title / Role")
    start_date: str = Field(..., description="Start Date (e.g. '2022-01' or 'Jan 2022')")
    end_date: str = Field(..., description="End Date (e.g. 'Present' or '2024-05')")
    bullet_points: List[str] = Field(default_factory=list, description="List of achievements or responsibilities")


class EducationSchema(BaseModel):
    institution: str = Field(..., min_length=1, max_length=255, description="Institution / University name")
    degree: str = Field(..., min_length=1, max_length=255, description="Degree or Major")
    completion_year: str = Field(..., description="Year of completion or expected graduation")


class ResumeBase(BaseModel):
    user_name: str = Field(..., min_length=1, max_length=255, description="Full Name")
    email: str = Field(..., description="Contact Email Address")
    phone: Optional[str] = Field(None, max_length=50, description="Contact Phone Number")
    portfolio_url: Optional[str] = Field(None, max_length=500, description="Portfolio or LinkedIn URL")
    template_id: str = Field(default="classic", description="Resume template identifier ('classic', 'modern')")
    experiences: List[ExperienceSchema] = Field(default_factory=list, description="Work experiences")
    education: List[EducationSchema] = Field(default_factory=list, description="Education records")
    skills: List[str] = Field(default_factory=list, description="List of skills")


class ResumeCreate(ResumeBase):
    pass


class ResumeUpdate(BaseModel):
    user_name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[str] = None
    phone: Optional[str] = None
    portfolio_url: Optional[str] = None
    template_id: Optional[str] = None
    experiences: Optional[List[ExperienceSchema]] = None
    education: Optional[List[EducationSchema]] = None
    skills: Optional[List[str]] = None


class ResumeResponse(ResumeBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ExportPdfRequest(BaseModel):
    resume_id: Optional[str] = Field(None, description="Optional UUID of existing resume")
    user_name: Optional[str] = Field(None, description="Full name if exporting directly")
    email: Optional[str] = Field(None, description="Email if exporting directly")
    phone: Optional[str] = None
    portfolio_url: Optional[str] = None
    template_id: Optional[str] = Field(None, description="Template to use for export ('classic', 'modern')")
    experiences: Optional[List[ExperienceSchema]] = None
    education: Optional[List[EducationSchema]] = None
    skills: Optional[List[str]] = None


class TemplateInfo(BaseModel):
    id: str
    name: str
    description: str
    category: str
