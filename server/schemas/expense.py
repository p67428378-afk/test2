import uuid
import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ExpenseBase(BaseModel):
    amount: float = Field(
        ..., gt=0, description="Expense monetary amount, must be greater than 0"
    )
    category: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Expense category e.g. Food & Dining",
    )
    date: datetime.date = Field(..., description="Date of expense in YYYY-MM-DD format")
    description: Optional[str] = Field(
        None, max_length=1000, description="Optional description or note"
    )


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(
        None, gt=0, description="Expense monetary amount, must be greater than 0"
    )
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    date: Optional[datetime.date] = None
    description: Optional[str] = Field(None, max_length=1000)


class ExpenseResponse(ExpenseBase):
    id: uuid.UUID
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
