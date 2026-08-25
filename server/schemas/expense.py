from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ExpenseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0)
    category_id: str
    expense_date: date
    payment_method: Optional[str] = Field(default="Credit Card", max_length=50)
    description: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title_not_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Expense title cannot be blank")
        return v.strip()


class ExpenseCreate(ExpenseBase):
    payment_method: str = Field(default="Credit Card", max_length=50)


class ExpenseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    amount: Optional[float] = Field(None, gt=0)
    category_id: Optional[str] = None
    expense_date: Optional[date] = None
    payment_method: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title_not_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            if not v or not v.strip():
                raise ValueError("Expense title cannot be blank")
            return v.strip()
        return v


class ExpenseResponse(BaseModel):
    id: str
    title: str
    amount: float
    category_id: str
    category_name: Optional[str] = None
    category_color: Optional[str] = None
    expense_date: date
    payment_method: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
