
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime, date

class SubmissionCreate(BaseModel):
    customer_pan: str = Field(..., max_length=10, min_length=10, pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$")
    financial_year: str = Field(..., pattern="^\\d{4}-\\d{2}$")
    declared_income: float
    digitally_signed_form_base64: str

class SubmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    submission_id: UUID
    status: str
    message: str
    submission_date: datetime

class SubmissionStatusResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    submission_id: UUID
    customer_pan: str
    financial_year: str
    form_type: str
    status: str
    submission_date: datetime
    updated_at: datetime
    validity_period_start: Optional[date]
    validity_period_end: Optional[date]
    estimated_tds_saving: Optional[float]
    rejection_reason: Optional[str]
