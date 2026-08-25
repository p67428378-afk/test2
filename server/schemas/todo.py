from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class TodoBase(BaseModel):
    title: str = Field(
        ..., min_length=1, max_length=255, description="Title of the todo item"
    )
    description: Optional[str] = Field(
        None, description="Detailed description of the todo item"
    )


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(
        None, min_length=1, max_length=255, description="Updated title"
    )
    description: Optional[str] = Field(None, description="Updated description")
    completed: Optional[bool] = Field(None, description="Updated completion status")


class Todo(TodoBase):
    id: str = Field(..., description="Unique UUID identifier for the todo item")
    completed: bool = Field(False, description="Completion status")
    created_at: datetime = Field(
        ..., description="Timestamp when the todo item was created"
    )
    updated_at: datetime = Field(
        ..., description="Timestamp when the todo item was last updated"
    )

    model_config = ConfigDict(from_attributes=True)
