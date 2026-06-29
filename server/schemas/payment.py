"""
Module: server.schemas.payment
Purpose: Payment schemas.
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class PaymentCreate(BaseModel):
    amount: float
    order_id: str
    payment_method: str


class PaymentResponse(BaseModel):
    id: str
    order_id: str
    status: str
    transaction_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
