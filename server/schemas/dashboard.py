from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class CategoryBreakdown(BaseModel):
    category: str
    total_amount: float
    count: int
    percentage: float

    model_config = ConfigDict(from_attributes=True)


class DashboardSummary(BaseModel):
    total_expenses: float
    total_count: int
    monthly_average: float
    top_category: Optional[str] = None
    expense_count: int
    by_category: List[CategoryBreakdown]
    category_breakdown: List[CategoryBreakdown]

    model_config = ConfigDict(from_attributes=True)
