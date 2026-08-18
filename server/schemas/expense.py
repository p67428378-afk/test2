from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Monetary amount, must be greater than 0")
    date: date
    category_id: str
    payment_method: str = Field(..., min_length=1)
    description: Optional[str] = None


class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[date] = None
    category_id: Optional[str] = None
    payment_method: Optional[str] = None
    description: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: str
    amount: float
    date: date
    category_id: str
    category_name: Optional[str] = None
    payment_method: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ExpenseListResponse(BaseModel):
    total: int
    skip: int
    limit: int
    items: List[ExpenseResponse]


class CategoryExpenseSummary(BaseModel):
    category_id: str
    category_name: str
    total_amount: float
    percentage: float


class ExpenseSummaryResponse(BaseModel):
    total_expense: float
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    by_category: List[CategoryExpenseSummary]
