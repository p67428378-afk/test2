from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional


# --- User / Auth Schemas ---
class UserCreate(BaseModel):
    username: str
    password: str
    role: Optional[str] = "admin"


class UserResponse(BaseModel):
    id: UUID
    username: str
    role: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None


# --- PlotType Schemas ---
class PlotTypeBase(BaseModel):
    name: str
    description: Optional[str] = None


class PlotTypeCreate(PlotTypeBase):
    pass


class PlotTypeResponse(PlotTypeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Plot Schemas ---
class PlotBase(BaseModel):
    plot_type_id: UUID
    status: str = "Available"
    section: str
    lot: str
    plot_number: str
    dimensions: str
    capacity: int = 1
    price: float = 0.00


class PlotCreate(PlotBase):
    pass


class PlotUpdate(PlotBase):
    pass


class PlotTypeNested(BaseModel):
    id: UUID
    name: str

    model_config = ConfigDict(from_attributes=True)


class PlotResponse(PlotBase):
    id: UUID
    plot_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PlotDetailResponse(PlotResponse):
    plot_type: PlotTypeNested

    model_config = ConfigDict(from_attributes=True)
