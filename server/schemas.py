from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ClassificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str | None = None
    email_id: str | None = None
    primary_category: str
    ai_category: str | None = None
    confidence_score: float
    user_override_category: str | None = None
    is_overridden: bool = False
    created_at: datetime | None = None
    updated_at: datetime | None = None


class EmailClassifyRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Email content or body text")
    subject: str | None = Field(None, max_length=500, description="Email subject line")
    sender: str | None = Field(
        None, max_length=255, description="Sender name or email address"
    )


class CategoryOverrideRequest(BaseModel):
    category: str = Field(
        ..., description="Target category: Work, Personal, Urgent, Promotional"
    )


class EmailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    sender: str | None = None
    subject: str | None = None
    body_text: str
    excerpt: str
    source_type: str
    file_name: str | None = None
    classification: ClassificationResponse
    created_at: datetime
    updated_at: datetime


class EmailListResponse(BaseModel):
    total: int
    skip: int
    limit: int
    items: list[EmailResponse]


class OverrideResponse(BaseModel):
    id: str
    classification: ClassificationResponse
    updated_at: datetime
