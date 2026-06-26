from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class InvoiceBase(BaseModel):
    patient_id: str
    appointment_id: Optional[str] = None
    amount: float
    tax: float
    discount: float
    billing_code: str


class InvoiceCreate(InvoiceBase):
    pass


class InvoiceResponse(InvoiceBase):
    id: str
    total_amount: float
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
