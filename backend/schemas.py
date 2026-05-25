
from pydantic import BaseModel
from typing import Optional
import uuid
import datetime
from backend.models import OTPStatus, BlockingStatus

class CardIdentifier(BaseModel):
    card_number: Optional[str] = None
    account_number: Optional[str] = None

class BlockCardRequest(BaseModel):
    identifier: CardIdentifier
    otp: str

class BlockCardResponse(BaseModel):
    status: BlockingStatus
    reference_number: str

class BlockingRequestBase(BaseModel):
    card_identifier: Optional[str]
    account_identifier: Optional[str]
    customer_id: str
    source_channel: str

class BlockingRequestCreate(BlockingRequestBase):
    pass

class BlockingRequestSchema(BlockingRequestBase):
    request_id: uuid.UUID
    otp_status: OTPStatus
    blocking_status: BlockingStatus
    reference_number: str
    timestamp: datetime.datetime

    class Config:
        orm_mode = True
