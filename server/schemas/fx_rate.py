from datetime import datetime
from pydantic import BaseModel


class FXRateResponse(BaseModel):
    ask_rate: float
    base_rate: float
    bid_rate: float
    converted_amount: float
    expires_at: datetime
    fee: float
    provider: str
    rate: float
    rate_lock_id: str
    source_currency: str
    spread: float
    target_currency: str

    class Config:
        from_attributes = True
