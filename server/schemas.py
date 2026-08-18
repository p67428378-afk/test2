from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


# Category Schemas
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=255)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=255)


class CategoryResponse(CategoryBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Expense Schemas
class ExpenseBase(BaseModel):
    amount: float = Field(..., gt=0, description="Amount must be greater than 0")
    date: date
    category_id: str
    payment_method: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = Field(None, max_length=255)


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[date] = None
    category_id: Optional[str] = None
    payment_method: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = Field(None, max_length=255)


class ExpenseResponse(ExpenseBase):
    id: str
    category_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Summary Schemas
class CategorySummary(BaseModel):
    category_id: str
    category_name: str
    total_amount: float
    percentage: float


class ExpenseSummaryResponse(BaseModel):
    total_expense: float
    total_transactions: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    by_category: List[CategorySummary]
