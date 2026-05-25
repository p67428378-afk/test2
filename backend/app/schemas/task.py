from pydantic import BaseModel
from datetime import date
from app.models.task import Priority

class TaskBase(BaseModel):
    description: str
    due_date: date
    priority: Priority

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    is_complete: bool

    class Config:
        from_attributes = True
