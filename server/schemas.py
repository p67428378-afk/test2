from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    summary: str = Field(..., min_length=1)
    full_description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    gallery_images: Optional[List[str]] = Field(default_factory=list)
    live_demo_url: Optional[str] = None
    github_url: Optional[str] = None
    client_context: Optional[str] = None


class ProjectRead(BaseModel):
    id: str
    title: str
    summary: str
    thumbnail_url: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    live_demo_url: Optional[str] = None
    github_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("tags", mode="before")
    @classmethod
    def extract_tags(cls, v: Any) -> List[str]:
        if not v:
            return []
        if isinstance(v, list):
            result = []
            for item in v:
                if hasattr(item, "tag"):
                    result.append(item.tag)
                elif isinstance(item, str):
                    result.append(item)
            return result
        return []


class ProjectDetail(BaseModel):
    id: str
    title: str
    summary: str
    full_description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    gallery_images: Optional[List[str]] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    live_demo_url: Optional[str] = None
    github_url: Optional[str] = None
    client_context: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("tags", mode="before")
    @classmethod
    def extract_tags(cls, v: Any) -> List[str]:
        if not v:
            return []
        if isinstance(v, list):
            result = []
            for item in v:
                if hasattr(item, "tag"):
                    result.append(item.tag)
                elif isinstance(item, str):
                    result.append(item)
            return result
        return []

    @field_validator("gallery_images", mode="before")
    @classmethod
    def validate_gallery_images(cls, v: Any) -> List[str]:
        if v is None:
            return []
        if isinstance(v, list):
            return [str(img) for img in v]
        return []


class LeadCreate(BaseModel):
    client_name: str = Field(..., min_length=1, max_length=150)
    email: EmailStr = Field(...)
    budget_range: str = Field(..., min_length=1, max_length=100)
    message: str = Field(..., min_length=1)


class LeadRead(BaseModel):
    id: str
    client_name: str
    email: str
    budget_range: str
    message: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
