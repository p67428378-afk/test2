from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "ROLE_EMPLOYEE"


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# --- Tag Schemas ---
class TagCreate(BaseModel):
    name: str


class TagOut(BaseModel):
    id: str
    name: str
    created_at: datetime
    note_count: Optional[int] = 0

    class Config:
        from_attributes = True


# --- Citation Schemas ---
class CitationCreate(BaseModel):
    title: str
    url: str
    citation_type: Optional[str] = "EXTERNAL"  # CONFLUENCE or EXTERNAL


class CitationOut(BaseModel):
    id: str
    note_id: str
    title: str
    url: str
    citation_type: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Review Schemas ---
class ReviewCreate(BaseModel):
    action: Optional[str] = "APPROVE"
    feedback: Optional[str] = None


class ReviewOut(BaseModel):
    id: str
    note_id: str
    reviewer_id: Optional[str] = None
    action: str
    feedback: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Research Note Schemas ---
class NoteCreate(BaseModel):
    title: str
    body: str
    category: Optional[str] = "General"
    tags: Optional[List[str]] = []
    citations: Optional[List[CitationCreate]] = []


class NoteOut(BaseModel):
    id: str
    title: str
    body: str
    category: str
    status: str
    author_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    tags: List[TagOut] = []
    citations: List[CitationOut] = []
    reviews: List[ReviewOut] = []

    class Config:
        from_attributes = True


class NoteListOut(BaseModel):
    id: str
    title: str
    body: str
    category: str
    status: str
    author_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    tags: List[TagOut] = []
    citations: List[CitationOut] = []

    class Config:
        from_attributes = True
