from pydantic import BaseModel, ConfigDict
from datetime import datetime
from server.app.schemas.film import FilmResponse


class WatchlistCreate(BaseModel):
    film_id: str


class WatchlistResponse(BaseModel):
    id: str
    user_id: str
    film_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WatchlistDetailResponse(BaseModel):
    id: str
    film: FilmResponse
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
