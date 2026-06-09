
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class Sku(BaseModel):
    id: UUID
    name: str
    sales: float
    profit_margin: float
    inventory_level: int
    status_badge: str

    class Config:
        orm_mode = True

class SkuPaginated(BaseModel):
    skus: List[Sku]
    page: int
    limit: int
    total_skus: int
