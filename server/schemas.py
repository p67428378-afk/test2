from datetime import date, datetime
from typing import Optional, List, Union
from pydantic import BaseModel, ConfigDict, EmailStr, model_validator, field_validator


class WorkExperienceBase(BaseModel):
    company_name: str
    role: str
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = False
    description: Optional[str] = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValueError("End date cannot be prior to start date")
        return self


class WorkExperienceCreate(WorkExperienceBase):
    pass


class WorkExperienceResponse(WorkExperienceBase):
    id: str
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


class EducationEntryBase(BaseModel):
    institution: str
    degree: str
    start_date: date
    end_date: Optional[date] = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValueError("End date cannot be prior to start date")
        return self


class EducationEntryCreate(EducationEntryBase):
    pass


class EducationEntryResponse(EducationEntryBase):
    id: str
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


class ResumeSkillCreate(BaseModel):
    skill_name: str


class ResumeSkillResponse(BaseModel):
    id: str
    skill_name: str
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


class ResumeCreate(BaseModel):
    title: str
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    summary: Optional[str] = None
    experiences: List[WorkExperienceCreate] = []
    education: List[EducationEntryCreate] = []
    skills: List[Union[str, ResumeSkillCreate]] = []


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    summary: Optional[str] = None
    experiences: Optional[List[WorkExperienceCreate]] = None
    education: Optional[List[EducationEntryCreate]] = None
    skills: Optional[List[Union[str, ResumeSkillCreate]]] = None


class ResumeResponse(BaseModel):
    id: str
    title: str
    full_name: str
    email: str
    phone: Optional[str] = None
    summary: Optional[str] = None
    experiences: List[WorkExperienceResponse] = []
    education: List[EducationEntryResponse] = []
    skills: List[str] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("skills", mode="before")
    @classmethod
    def serialize_skills(cls, v):
        if isinstance(v, list):
            result = []
            for item in v:
                if isinstance(item, str):
                    result.append(item)
                elif hasattr(item, "skill_name"):
                    result.append(item.skill_name)
                elif isinstance(item, dict) and "skill_name" in item:
                    result.append(item["skill_name"])
            return result
        return v
