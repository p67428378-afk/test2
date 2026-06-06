
from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import List, Optional

# Base Schemas
class SnackBase(BaseModel):
    name: str

class InventoryItemBase(BaseModel):
    quantity: int
    location: Optional[str] = None
    expiry_date: Optional[datetime] = None

# Schemas for creating new data
class SnackCreate(SnackBase):
    pass

class InventoryItemCreate(InventoryItemBase):
    snack_id: UUID4

class SnackRequestCreate(BaseModel):
    name: str
    quantity: int

class ConsumptionRecordCreate(BaseModel):
    quantity_consumed: int

# Schemas for updating data
class InventoryItemUpdate(BaseModel):
    expiry_date: Optional[datetime] = None

# Schemas for reading data
class Snack(SnackBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class InventoryItem(InventoryItemBase):
    id: UUID4
    snack_id: UUID4
    created_at: datetime
    updated_at: datetime
    snack_name: str

    class Config:
        orm_mode = True

class SnackRequest(BaseModel):
    id: UUID4
    snack_name: str
    quantity: int
    requested_at: datetime

    class Config:
        orm_mode = True

class ExpiryAlert(InventoryItem):
    alert_status: str

# Response Models
class SnackRequestResponse(BaseModel):
    request_id: UUID4
    message: str

class ConsumeResponse(BaseModel):
    message: str

class UpdateInventoryResponse(BaseModel):
    message: str
