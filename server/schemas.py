from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class LearningItemResponse(BaseModel):
    id: str
    type: str
    value: str
    word_association: Optional[str] = None
    image_url: str
    audio_url: str

    class Config:
        from_attributes = True


class ProgressLogRequest(BaseModel):
    learning_item_id: str


class ProgressLogResponse(BaseModel):
    id: str
    user_id: str
    learning_item_id: str
    completed_at: datetime

    class Config:
        from_attributes = True


class ProgressSummaryResponse(BaseModel):
    total_stars: int
    explored_item_ids: List[str]
