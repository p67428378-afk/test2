
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class ItemBase(BaseModel):
    name: str
    type: str
    material: str
    weight: float
    cost: float
    selling_price: float
    stock_level: int
    location: str
    status: Optional[str] = "Available"

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    material: Optional[str] = None
    weight: Optional[float] = None
    cost: Optional[float] = None
    selling_price: Optional[float] = None
    stock_level: Optional[int] = None
    location: Optional[str] = None
    status: Optional[str] = None

class Item(ItemBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
