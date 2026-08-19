from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, field_validator
from server.schemas.user import UserSummary


VALID_PRIORITIES = {"Low", "Medium", "High", "Urgent"}
VALID_STATUSES = {"Pending", "In Progress", "Completed"}


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    location_equipment: str = Field(..., min_length=1, max_length=200)
    priority: str = "Medium"
    estimated_cost: float = Field(default=0.0, ge=0.0)
    due_date: datetime
    assigned_to_id: Optional[str] = None

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: str) -> str:
        if v not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of {VALID_PRIORITIES}")
        return v

    @field_validator("estimated_cost")
    @classmethod
    def validate_estimated_cost(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Estimated cost cannot be negative")
        return v


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    location_equipment: Optional[str] = Field(None, min_length=1, max_length=200)
    priority: Optional[str] = None
    estimated_cost: Optional[float] = Field(None, ge=0.0)
    due_date: Optional[datetime] = None
    status: Optional[str] = None

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of {VALID_PRIORITIES}")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of {VALID_STATUSES}")
        return v

    @field_validator("estimated_cost")
    @classmethod
    def validate_cost(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError("Estimated cost cannot be negative")
        return v


class TaskAssign(BaseModel):
    assigned_to_id: str


class TaskComplete(BaseModel):
    actual_cost: float = Field(..., ge=0.0)
    resolution_notes: str = Field(..., min_length=1)

    @field_validator("actual_cost")
    @classmethod
    def validate_actual_cost(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Actual cost cannot be negative")
        return v

    @field_validator("resolution_notes")
    @classmethod
    def validate_notes(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Resolution notes cannot be empty")
        return v


class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    location_equipment: str
    priority: str
    status: str
    estimated_cost: float
    actual_cost: float
    due_date: datetime
    assigned_to_id: Optional[str] = None
    assigned_to: Optional[UserSummary] = None
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class TaskListResponse(BaseModel):
    items: List[TaskResponse]
    total: int
    skip: int
    limit: int
