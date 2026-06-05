from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID
    preferences: Optional[dict] = None

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class MovieBase(BaseModel):
    tmdb_id: int
    title: str
    description: Optional[str] = None
    release_date: Optional[datetime.date] = None
    poster_url: Optional[str] = None

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: UUID

    class Config:
        orm_mode = True

class WatchHistoryBase(BaseModel):
    movie_id: UUID
    watched_on: datetime.date
    rating: Optional[int] = None

class WatchHistoryCreate(WatchHistoryBase):
    pass

class WatchHistory(WatchHistoryBase):
    id: UUID
    user_id: UUID

    class Config:
        orm_mode = True
