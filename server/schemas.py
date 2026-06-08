from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SnackBase(BaseModel):
    name: str


class SnackCreate(SnackBase):
    pass


class Snack(SnackBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class InventoryItemBase(BaseModel):
    quantity: int
    location: str | None = None
    expiry_date: datetime | None = None


class InventoryItemCreate(InventoryItemBase):
    snack_id: UUID


class InventoryItemUpdate(InventoryItemBase):
    pass


class InventoryItem(InventoryItemBase):
    id: UUID
    snack_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class SnackRequestBase(BaseModel):
    snack_name: str
    quantity: int


class SnackRequestCreate(SnackRequestBase):
    pass


class SnackRequest(SnackRequestBase):
    id: UUID
    requested_at: datetime

    class Config:
        orm_mode = True


class ConsumptionRecordBase(BaseModel):
    inventory_item_id: UUID
    quantity_consumed: int


class ConsumptionRecordCreate(ConsumptionRecordBase):
    pass


class ConsumptionRecord(ConsumptionRecordBase):
    id: UUID
    consumed_at: datetime

    class Config:
        orm_mode = True


class ExpiryAlert(BaseModel):
    id: UUID
    snack_name: str
    quantity: int
    location: str | None = None
    expiry_date: datetime
    alert_status: str

    class Config:
        orm_mode = True


class ConsumeRequest(BaseModel):
    quantity_consumed: int
