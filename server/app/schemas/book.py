from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from uuid import UUID


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, description="The title of the book")
    isbn: str = Field(
        ..., min_length=1, description="The unique International Standard Book Number"
    )
    author: Optional[str] = Field(default="", description="The author of the book")
    publication_date: Optional[date] = Field(
        default=None, description="The publication date of the book (YYYY-MM-DD)"
    )


class BookCreate(BookBase):
    pass


class Book(BookBase):
    id: UUID
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
