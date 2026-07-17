from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional


class ProductSchema(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class WishlistItemCreateRequest(BaseModel):
    product_id: UUID


class WishlistItemCreateResponse(BaseModel):
    id: UUID
    product_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WishlistItemResponse(BaseModel):
    id: UUID
    product: ProductSchema

    model_config = ConfigDict(from_attributes=True)
