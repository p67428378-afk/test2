from typing import List, Optional
from pydantic import BaseModel


class CategoryCostBreakdown(BaseModel):
    category_id: Optional[str] = None
    category_name: str
    estimated: float
    actual: float
    variance: float  # actual - estimated or estimated - actual; standard: variance = actual - estimated


class CostSummaryResponse(BaseModel):
    total_estimated: float
    total_actual: float
    variance: float
    category_breakdown: List[CategoryCostBreakdown]
