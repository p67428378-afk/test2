from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# Login Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# Quote Schemas
class QuoteBase(BaseModel):
    text: str
    author: str
    category: Optional[str] = None


class QuoteCreate(QuoteBase):
    pass


class QuoteResponse(QuoteBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# Favorite Schemas
class FavoriteBase(BaseModel):
    quote_id: str


class FavoriteCreate(BaseModel):
    quote_id: Optional[str] = None
    text: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None


class FavoriteResponse(BaseModel):
    id: str
    user_id: str
    quote_id: str
    created_at: datetime
    quote: QuoteResponse

    class Config:
        from_attributes = True
