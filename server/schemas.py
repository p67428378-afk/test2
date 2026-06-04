from pydantic import BaseModel
from datetime import datetime
import uuid

class TodoBase(BaseModel):
    title: str

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        orm_mode = True
