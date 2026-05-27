
from pydantic import BaseModel, UUID4
from typing import Literal

class SpendAlertSetup(BaseModel):
    card_number: str
    daily_spend_threshold: float
    alert_delivery_channel: Literal["SMS", "EMAIL"]

class SpendAlertSetupResponse(BaseModel):
    message: str
    transaction_id: UUID4

class SpendAlertVerification(BaseModel):
    transaction_id: UUID4
    otp_code: str

class SpendAlertStatus(BaseModel):
    status: str
    threshold_amount: float
    alert_delivery_channel: str
