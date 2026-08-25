from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "staff"


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# --- Item Schemas ---
class ItemBase(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    unit_price: float = 0.0
    reorder_threshold: int = 0


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    unit_price: Optional[float] = None
    reorder_threshold: Optional[int] = None


class ItemResponse(ItemBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Warehouse Schemas ---
class WarehouseBase(BaseModel):
    name: str
    location: Optional[str] = None


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseResponse(WarehouseBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Inventory Schemas ---
class InventoryBase(BaseModel):
    item_id: str
    warehouse_id: str
    current_stock: int = 0


class InventoryCreate(InventoryBase):
    pass


class InventoryUpdate(BaseModel):
    warehouse_id: str
    current_stock: int


class InventoryResponse(InventoryBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LowStockAlertResponse(BaseModel):
    sku: str
    name: str
    warehouse: str
    current_stock: int
    threshold: int
    status: str


# --- StockAdjustment Schemas ---
class StockAdjustmentBase(BaseModel):
    item_id: str
    warehouse_id: str
    adjustment_type: str  # addition, reduction, transfer
    quantity: int
    reason_code: str
    notes: Optional[str] = None


class StockAdjustmentCreate(BaseModel):
    warehouse_id: str
    adjustment_type: str
    quantity: int
    reason_code: str
    notes: Optional[str] = None


class StockAdjustmentResponse(StockAdjustmentBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class StockTransferCreate(BaseModel):
    source_warehouse_id: str
    destination_warehouse_id: str
    quantity: int
    notes: Optional[str] = None


# --- Paginated Responses ---
class PaginatedItemsResponse(BaseModel):
    items: List[ItemResponse]
    total: int
    skip: int
    limit: int
