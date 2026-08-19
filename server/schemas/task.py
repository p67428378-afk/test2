from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator
from server.schemas.category import CategoryRead
from server.schemas.user import UserRead


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, description="Task title is required")
    description: Optional[str] = None
    category_id: str
    priority: str = Field("Medium", description="Low, Medium, High, Urgent")
    estimated_cost: float = Field(
        0.0, ge=0, description="Estimated cost must be non-negative"
    )
    frequency: str = Field(
        "One-time", description="One-time, Weekly, Monthly, Quarterly, Annual"
    )
    due_date: date
    assigned_user_id: Optional[str] = None

    @field_validator("priority")
    def validate_priority(cls, v):
        allowed = ["Low", "Medium", "High", "Urgent"]
        if v not in allowed:
            raise ValueError(f"Priority must be one of {allowed}")
        return v

    @field_validator("frequency")
    def validate_frequency(cls, v):
        allowed = ["One-time", "Weekly", "Monthly", "Quarterly", "Annual"]
        if v not in allowed:
            raise ValueError(f"Frequency must be one of {allowed}")
        return v


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    priority: Optional[str] = None
    estimated_cost: Optional[float] = Field(None, ge=0)
    actual_cost: Optional[float] = Field(None, ge=0)
    frequency: Optional[str] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    assigned_user_id: Optional[str] = None


class TaskAssignRequest(BaseModel):
    assigned_user_id: Optional[str] = None


class TaskRead(TaskBase):
    id: str
    actual_cost: Optional[float] = None
    status: str
    created_by: str
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryRead] = None
    assigned_user: Optional[UserRead] = None

    class Config:
        from_attributes = True
