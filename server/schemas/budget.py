from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class BudgetCreate(BaseModel):
    category_id: str
    monthly_limit: float = Field(..., gt=0)
    month: int = Field(..., ge=1, le=12)
    year: int = Field(..., ge=2020)


class BudgetUpdate(BaseModel):
    monthly_limit: Optional[float] = Field(None, gt=0)


class BudgetResponse(BaseModel):
    id: str
    category_id: str
    category_name: Optional[str] = None
    category_color: Optional[str] = None
    monthly_limit: float
    month: int
    year: int
    total_spent: float = 0.0
    remaining_balance: float = 0.0
    utilization_percentage: float = 0.0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
