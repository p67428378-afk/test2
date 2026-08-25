from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from server.app.schemas.film import FilmResponse


class RatingCreate(BaseModel):
    film_id: str
    rating: int = Field(..., ge=1, le=5)


class RatingResponse(BaseModel):
    id: str
    user_id: str
    film_id: str
    rating: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RatingDetailResponse(BaseModel):
    id: str
    rating: int
    film: FilmResponse
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
