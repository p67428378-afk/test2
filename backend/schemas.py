from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class LinkedAccountBase(BaseModel):
    customer_id: str
    checking_account_id: str
    savings_account_id: str
    is_enabled: Optional[bool] = True

class LinkedAccountCreate(LinkedAccountBase):
    pass

class LinkedAccount(LinkedAccountBase):
    id: str
    linked_date: datetime

    class Config:
        from_attributes = True

class OverdraftTransferEventBase(BaseModel):
    transaction_id: str
    checking_account_id: str
    savings_account_id: str
    amount: float
    status: str
    reason: Optional[str] = None

class OverdraftTransferEventCreate(OverdraftTransferEventBase):
    pass

class OverdraftTransferEvent(OverdraftTransferEventBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True

class NotificationLogBase(BaseModel):
    event_id: str
    recipient: str
    channel: str
    message: str
    status: str

class NotificationLogCreate(NotificationLogBase):
    pass

class NotificationLog(NotificationLogBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True

class AccountLinkRequest(BaseModel):
    checking_account_id: str
    savings_account_id: str

class AccountLinkResponse(BaseModel):
    message: str
    linked_account: Optional[LinkedAccount] = None

class OverdraftProtectionStatusUpdate(BaseModel):
    is_enabled: bool

class NotificationPreferenceUpdate(BaseModel):
    email_enabled: Optional[bool] = None
    sms_enabled: Optional[bool] = None

class UserNotificationPreferences(BaseModel):
    customer_id: str
    email_enabled: bool = True
    sms_enabled: bool = False

    class Config:
        from_attributes = True
