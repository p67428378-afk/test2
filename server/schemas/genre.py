import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict

class GenreBase(BaseModel):
    code: str
    display_name: str
    description: Optional[str] = None

class GenreResponse(GenreBase):
    id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)
