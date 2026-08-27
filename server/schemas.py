"""Pydantic schemas for API validation and serialization."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class DocumentCreate(BaseModel):
    """Schema for creating a document."""

    title: Optional[str] = Field(default="Untitled Document", max_length=255)
    content: str


class DocumentUpdate(BaseModel):
    """Schema for updating an existing document."""

    title: Optional[str] = Field(default=None, max_length=255)
    content: Optional[str] = None


class DocumentResponse(BaseModel):
    """Schema for a full document response."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime


class DocumentListItem(BaseModel):
    """Schema for an item in the document list response."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    created_at: datetime
    updated_at: datetime


class DocumentListResponse(BaseModel):
    """Schema for a paginated list of documents."""

    total: int
    skip: int
    limit: int
    items: List[DocumentListItem]
