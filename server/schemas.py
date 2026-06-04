from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class TodoBase(BaseModel):
    title: str

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True
