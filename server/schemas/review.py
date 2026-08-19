from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from server.schemas.user import UserResponse


class ReviewCreate(BaseModel):
    session_id: str
    score: int = Field(..., ge=1, le=10)
    comments: Optional[str] = None
    decision: str  # APPROVED or REJECTED


class ReviewResponse(BaseModel):
    id: str
    session_id: str
    reviewer_id: str
    score: int
    comments: Optional[str] = None
    decision: str
    created_at: datetime
    reviewer: Optional[UserResponse] = None

    class Config:
        from_attributes = True
