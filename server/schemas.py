
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

class TaskBase(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

class TaskCreate(TaskBase):
    title: str

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
