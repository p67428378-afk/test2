from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal

# --- Customer Schemas ---
class CustomerBase(BaseModel):
    name: str
    contact_info: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    contact_info: Optional[str] = None

class CustomerResponse(CustomerBase):
    customer_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True

class CustomerListResponse(BaseModel):
    items: List[CustomerResponse]
    limit: int
    skip: int
    total: int


# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    cost: Decimal = Field(default=Decimal("0.00"))
    price: Decimal = Field(default=Decimal("0.00"))
    stock_quantity: int = Field(default=0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cost: Optional[Decimal] = None
    price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None

class ProductResponse(ProductBase):
    product_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    limit: int
    skip: int
    total: int


# --- Order / Quote Line Item Schemas ---
class LineItemBase(BaseModel):
    product_id: UUID
    quantity: int
    custom_price: Optional[Decimal] = None
    height: Optional[float] = None
    width: Optional[float] = None

class LineItemResponse(LineItemBase):
    name: Optional[str] = None
    price: Optional[Decimal] = None


# --- Order / Quote Schemas ---
class OrderCreate(BaseModel):
    customer_id: UUID
    discount: Optional[Decimal] = None
    is_quote: bool = False
    line_items: List[LineItemBase]

class OrderUpdate(BaseModel):
    line_items: Optional[List[LineItemBase]] = None
    status: Optional[str] = None
    total_price: Optional[Decimal] = None

class OrderResponse(BaseModel):
    order_id: Optional[UUID] = None
    quote_id: Optional[UUID] = None
    customer_id: UUID
    customer_name: Optional[str] = None
    status: str
    line_items: List[LineItemResponse]
    total_price: Decimal
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True

class OrderListResponse(BaseModel):
    items: List[OrderResponse]
    limit: int
    skip: int
    total: int


# --- Interaction Schemas ---
class InteractionBase(BaseModel):
    customer_id: UUID
    type: str
    notes: Optional[str] = None

class InteractionCreate(InteractionBase):
    pass

class InteractionResponse(InteractionBase):
    interaction_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


# --- Report Schemas ---
class SalesHistoryItem(BaseModel):
    date: str
    revenue: Decimal

class ReportResponse(BaseModel):
    active_orders_count: int
    low_stock_count: int
    sales_history: List[SalesHistoryItem]
    total_revenue: Decimal
