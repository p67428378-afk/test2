from pydantic import BaseModel, ConfigDict
import uuid

class TopUpApplicationCreate(BaseModel):
    loan_account_number: str

class TopUpApplicationResponse(BaseModel):
    application_id: uuid.UUID
    status: str
    eligible_amount: float | None = None
    reason: str | None = None

    model_config = ConfigDict(from_attributes=True)
