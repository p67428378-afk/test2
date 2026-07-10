from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List


class TaskBase(BaseModel):
    text: str = Field(..., min_length=1, description="The description of the task.")


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    text: Optional[str] = Field(None, min_length=1)
    is_completed: Optional[bool] = None
    position: Optional[int] = None


class TaskReorder(BaseModel):
    task_ids: List[UUID]


class TaskResponse(BaseModel):
    id: UUID
    text: str
    is_completed: bool
    position: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
