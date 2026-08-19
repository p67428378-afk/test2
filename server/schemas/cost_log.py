from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class CostLogCreate(BaseModel):
    task_id: str
    cost_type: str = "Actual"
    amount: float = Field(..., ge=0.0)
    notes: Optional[str] = None


class CostLogResponse(BaseModel):
    id: str
    task_id: str
    cost_type: str
    amount: float
    notes: Optional[str] = None
    recorded_by_id: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CostSummaryResponse(BaseModel):
    total_estimated_cost: float
    total_actual_cost: float
    cost_variance: float
    completed_tasks_count: int
    pending_tasks_count: int
