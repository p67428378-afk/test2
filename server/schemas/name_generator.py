from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field

class NameGenerateRequest(BaseModel):
    genre: Optional[str] = Field(default="general")
    quantity: Optional[Any] = Field(default=5)
    sub_tags: Optional[List[str]] = Field(default=None)

class NameGenerateResponse(BaseModel):
    genre: str
    quantity: int
    names: List[str]
    generated_at: datetime

class ErrorResponse(BaseModel):
    detail: str
