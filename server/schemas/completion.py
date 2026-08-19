from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CompletionLogCreate(BaseModel):
    completed_at: Optional[datetime] = None
    actual_cost: Optional[float] = Field(
        None,
        ge=0,
        description="Actual cost incurred. Defaults to estimated cost if not provided.",
    )
    notes: Optional[str] = None
    receipt_reference: Optional[str] = None


class CompletionLogRead(BaseModel):
    id: str
    task_id: str
    completed_by: str
    completed_at: datetime
    actual_cost: float
    notes: Optional[str] = None
    receipt_reference: Optional[str] = None
    next_task_id: Optional[str] = None

    class Config:
        from_attributes = True


class TaskCompletionResponse(BaseModel):
    log_id: str
    task_id: str
    status: str = "Completed"
    actual_cost: float
    next_task_id: Optional[str] = None
