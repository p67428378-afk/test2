
from pydantic import BaseModel
from uuid import UUID

class OrderBase(BaseModel):
    instrument_id: str
    quantity: int
    price: float
    order_type: str

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: UUID
    status: str
    trader_id: UUID

    class Config:
        orm_mode = True
