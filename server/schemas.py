import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    id: UUID
    email: EmailStr
    preferences: dict | None = None

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


class Movie(BaseModel):
    id: UUID
    tmdb_id: int
    title: str
    description: str | None = None
    release_date: datetime.date | None = None
    poster_url: str | None = None

    class Config:
        orm_mode = True


class WatchHistoryCreate(BaseModel):
    movie_id: UUID
    watched_on: datetime.date
    rating: int | None = None


class WatchHistoryUpdate(BaseModel):
    rating: int | None = None


class WatchHistory(BaseModel):
    id: UUID
    user_id: UUID
    movie_id: UUID
    watched_on: datetime.date
    rating: int | None = None
    movie: Movie

    class Config:
        orm_mode = True
