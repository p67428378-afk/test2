from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    name: str
    email: str
    role: str


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Incident Schemas
class IncidentCreate(BaseModel):
    affected_system: str
    description: str
    occurred_at: datetime
    priority: str = Field(..., pattern="^(Low|Medium|High)$")
    reporter_email: str
    reporter_name: str


class IncidentUpdate(BaseModel):
    assignee_id: Optional[str] = None
    internal_notes: Optional[str] = None
    priority: Optional[str] = Field(None, pattern="^(Low|Medium|High)$")
    status: Optional[str] = Field(None, pattern="^(Open|In Progress|Resolved|Closed)$")


class IncidentResponse(BaseModel):
    id: str
    title: str
    description: str
    status: str
    priority: str
    affected_system: str
    reporter_name: str
    reporter_email: str
    assignee_id: Optional[str] = None
    internal_notes: Optional[str] = None
    occurred_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class IncidentListResponse(BaseModel):
    items: List[IncidentResponse]
    total: int


# SLA Schemas
class SLABase(BaseModel):
    priority: str = Field(..., pattern="^(Low|Medium|High)$")
    response_time: int
    resolution_time: int


class SLACreate(SLABase):
    pass


class SLAResponse(SLABase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# RCA Schemas
class RCAReportCreate(BaseModel):
    content: str


class RCAReportResponse(BaseModel):
    id: str
    incident_id: str
    content: str
    updated_at: datetime

    class Config:
        from_attributes = True


class RCAReportDetailResponse(BaseModel):
    id: str
    incident_id: str
    content: str
    timeline: List[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
