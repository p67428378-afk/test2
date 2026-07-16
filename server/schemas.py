from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from uuid import UUID
from datetime import datetime


# Property Schemas
class PropertyBase(BaseModel):
    title: str
    location: str
    price: float
    bedrooms: int
    bathrooms: float
    description: Optional[str] = None
    image_urls: List[str] = []


class PropertyCreate(PropertyBase):
    pass


class PropertyResponse(PropertyBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# Contact Schemas
class ContactCreate(BaseModel):
    property_id: UUID
    user_name: str = Field(..., min_length=1)
    user_email: EmailStr
    message: str = Field(..., min_length=1)


class ContactResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    property_id: UUID
    user_name: str
    user_email: str
    message: str
    created_at: datetime
