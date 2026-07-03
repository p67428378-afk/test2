"""
Module: schemas
Purpose: Pydantic schemas for request/response validation and serialization
"""

from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, EmailStr, Field


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = "member"


class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class LoginResponseUser(BaseModel):
    id: str
    email: str
    role: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: LoginResponseUser


# Task Schemas
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: str = Field(..., pattern="^(High|Med|Low)$")
    due_date: datetime
    assignee_id: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    priority: Optional[str] = Field(None, pattern="^(High|Med|Low)$")
    due_date: Optional[datetime] = None
    status: Optional[str] = Field(None, pattern="^(To Do|In Progress|Review|Done)$")
    assignee_id: Optional[str] = None


class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    due_date: datetime
    assignee_id: Optional[str] = None
    reporter_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Report Schemas
class CompletionTrendItem(BaseModel):
    day: str
    completed: int


class DashboardMetrics(BaseModel):
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    overdue_tasks: int
    tasks_by_priority: Dict[str, int]
    completion_trend: List[CompletionTrendItem]
