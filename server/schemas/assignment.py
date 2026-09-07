from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class AssignmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: datetime
    max_points: float = 100.0


class AssignmentCreate(AssignmentBase):
    course_id: str


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    max_points: Optional[float] = None


class AssignmentResponse(AssignmentBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    course_id: str
    created_at: datetime
    updated_at: datetime
    submission_count: Optional[int] = 0
