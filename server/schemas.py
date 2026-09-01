"""Pydantic schemas for data validation and serialization."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# Base Config
class ORMBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(
        ..., min_length=8, description="Password must be at least 8 characters"
    )
    full_name: str = Field(..., min_length=1, description="Full name of user")
    role: Optional[str] = Field("Member", description="Role: Member or Admin")


class UserResponse(ORMBase):
    id: str
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    user_id: Optional[str] = None


# Project Schemas
class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1)
    description: Optional[str] = None
    status: Optional[str] = "Planning"


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class ProjectResponse(ORMBase):
    id: str
    name: str
    description: Optional[str] = None
    status: str
    owner_id: str
    created_at: datetime
    updated_at: datetime


# Task Schemas
class TaskCreate(BaseModel):
    project_id: str
    summary: str = Field(..., min_length=1)
    description: Optional[str] = None
    priority: Optional[str] = "Medium"
    status: Optional[str] = "To Do"
    assignee_id: Optional[str] = None
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    summary: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assignee_id: Optional[str] = None
    due_date: Optional[datetime] = None


class TaskResponse(ORMBase):
    id: str
    project_id: str
    assignee_id: Optional[str] = None
    summary: str
    description: Optional[str] = None
    priority: str
    status: str
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None


class BulkTaskUpdate(BaseModel):
    task_ids: List[str] = Field(..., min_length=1)
    status: str = Field(
        ..., description="Target status: To Do, In Progress, Done, Completed"
    )


class BulkTaskUpdateResponse(BaseModel):
    updated_count: int
    tasks: List[TaskResponse]


# Comment Schemas
class CommentCreate(BaseModel):
    body: str = Field(..., min_length=1)


class CommentUpdate(BaseModel):
    body: str = Field(..., min_length=1)


class CommentResponse(ORMBase):
    id: str
    task_id: str
    author_id: str
    body: str
    created_at: datetime
    updated_at: datetime


# Escalation Schemas
class EscalationLogResponse(ORMBase):
    id: str
    task_id: str
    project_id: Optional[str] = None
    reason: str
    notified_user_id: Optional[str] = None
    created_at: datetime


# Analytics Schemas
class TaskAnalyticsResponse(BaseModel):
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    todo_tasks: int
    completion_rate: float
    status_distribution: Dict[str, int]
    priority_distribution: Dict[str, int]


class ProductivityAnalyticsResponse(BaseModel):
    average_cycle_time_hours: float
    total_completed_tasks: int
    productivity_by_assignee: List[Dict[str, Any]]
