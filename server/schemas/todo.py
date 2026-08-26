from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator


class TodoBase(BaseModel):
    title: str = Field(
        ..., min_length=1, max_length=255, description="Title of the TODO task"
    )
    description: Optional[str] = Field(
        default=None, description="Detailed description of the TODO task"
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Title cannot be empty or whitespace-only")
        return v


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(
        default=None, min_length=1, max_length=255, description="Updated title"
    )
    description: Optional[str] = Field(default=None, description="Updated description")
    completed: Optional[bool] = Field(
        default=None, description="Updated completion status"
    )

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and (not v or not v.strip()):
            raise ValueError("Title cannot be empty or whitespace-only")
        return v


class TodoResponse(BaseModel):
    id: str = Field(..., description="Unique UUID identifier for the TODO item")
    title: str = Field(..., description="Title of the TODO item")
    description: Optional[str] = Field(
        default=None, description="Description of the TODO item"
    )
    completed: bool = Field(..., description="Completion status flag")
    created_at: datetime = Field(..., description="Creation timestamp in UTC")
    updated_at: datetime = Field(..., description="Last update timestamp in UTC")

    model_config = ConfigDict(from_attributes=True)
