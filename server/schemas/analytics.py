from typing import List
from pydantic import BaseModel


class AnalyticsSummary(BaseModel):
    total_spent: float
    monthly_budget_limit: float
    remaining_balance: float
    daily_average: float
    transaction_count: int
    categories_over_limit_count: int
    over_limit_categories: List[str]


class CategoryBreakdownItem(BaseModel):
    category_id: str
    category_name: str
    category_color: str
    total_amount: float
    percentage: float
    transaction_count: int


class MonthlyTrendItem(BaseModel):
    month: int
    year: int
    period: str
    total_amount: float
    budget_limit: float
    transaction_count: int
