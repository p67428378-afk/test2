from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class PublicationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    doi: Optional[str] = None
    authors: Optional[str] = None
    journal_publisher: Optional[str] = None
    publication_date: Optional[str] = None


class PublicationCreate(PublicationBase):
    pass


class PublicationResponse(PublicationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ArtifactPublicationLink(BaseModel):
    artifact_id: str
    publication_id: str
