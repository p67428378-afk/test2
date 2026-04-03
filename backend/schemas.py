from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class AccountConfigurationBase(BaseModel):
    checking_account_id: str
    savings_account_id: str
    is_enabled: bool = True
    notification_preferences: Optional[Dict[str, Any]] = None

class AccountConfigurationCreate(AccountConfigurationBase):
    pass

class AccountConfigurationUpdate(BaseModel):
    is_enabled: Optional[bool] = None
    notification_preferences: Optional[Dict[str, Any]] = None

class AccountConfigurationResponse(AccountConfigurationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class ConfigDict:
        from_attributes = True

class OverdraftTransferEventBase(BaseModel):
    transaction_id: str
    amount: float
    from_account: str
    to_account: str
    status: str
    details: Optional[Dict[str, Any]] = None

class OverdraftTransferEventResponse(OverdraftTransferEventBase):
    id: str
    timestamp: datetime
    account_config_id: str

    class ConfigDict:
        from_attributes = True

class NotificationLogBase(BaseModel):
    user_id: str
    type: str
    recipient: str
    status: str
    attempt_count: int = 0
    last_attempt_time: Optional[datetime] = None

class NotificationLogResponse(NotificationLogBase):
    id: str
    event_id: str

    class ConfigDict:
        from_attributes = True
