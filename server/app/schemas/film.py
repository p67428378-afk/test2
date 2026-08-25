from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class FilmBase(BaseModel):
    title: str
    release_year: int
    genre: str
    poster_url: Optional[str] = None


class FilmCreate(FilmBase):
    pass


class FilmResponse(FilmBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
