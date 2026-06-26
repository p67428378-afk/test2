from datetime import datetime
from pydantic import BaseModel, ConfigDict


class PaymentBase(BaseModel):
    invoice_id: str
    amount: float
    payment_method: str


class PaymentCreate(PaymentBase):
    pass


class PaymentResponse(PaymentBase):
    id: str
    payment_date: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
