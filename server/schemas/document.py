from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class DocumentCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Document title")
    content: str = Field(default="", description="Raw Markdown content")


class DocumentUpdate(BaseModel):
    title: Optional[str] = Field(
        default=None, min_length=1, max_length=255, description="Document title"
    )
    content: Optional[str] = Field(default=None, description="Raw Markdown content")


class DocumentResponse(BaseModel):
    id: UUID
    title: str
    content: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
