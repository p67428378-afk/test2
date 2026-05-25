
from pydantic import BaseModel
from typing import List
from uuid import UUID
from datetime import datetime

class SaleItemBase(BaseModel):
    item_id: UUID
    quantity: int
    price: float

class SaleItemCreate(SaleItemBase):
    pass

class SaleItem(SaleItemBase):
    id: UUID

    class Config:
        orm_mode = True

class SaleBase(BaseModel):
    customer_id: UUID
    items: List[SaleItemCreate]

class SaleCreate(SaleBase):
    pass

class Sale(BaseModel):
    id: UUID
    date: datetime
    customer_id: UUID
    total_amount: float
    profit: float

    class Config:
        orm_mode = True
