
from pydantic import BaseModel
from uuid import UUID

class PositionBase(BaseModel):
    instrument_id: str
    quantity: int
    average_price: float

class PositionCreate(PositionBase):
    pass

class Position(PositionBase):
    id: UUID
    trader_id: UUID

    class Config:
        orm_mode = True
