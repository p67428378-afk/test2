from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


# Auth Schemas
class UserSignUp(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: Optional[str] = None


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    name: Optional[str] = None

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


# Expense Schemas
class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Amount must be greater than 0")
    category: str = Field(..., min_length=1)
    description: Optional[str] = None
    expense_date: str = Field(
        ..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Date in YYYY-MM-DD format"
    )


class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(
        None, gt=0, description="Amount must be greater than 0"
    )
    category: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    expense_date: Optional[str] = Field(
        None, pattern=r"^\d{4}-\d{2}-\d{2}$", description="Date in YYYY-MM-DD format"
    )


class ExpenseResponse(BaseModel):
    id: UUID
    user_id: UUID
    amount: float
    category: str
    description: Optional[str] = None
    expense_date: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
