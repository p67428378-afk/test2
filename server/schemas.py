from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


# Seller Schemas
class SellerRegister(BaseModel):
    store_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone_number: Optional[str] = Field(None, max_length=50)
    password: str = Field(..., min_length=6)


class SellerResponse(BaseModel):
    id: str
    store_name: str
    email: EmailStr
    phone_number: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class SellerLogin(BaseModel):
    email: EmailStr
    password: str


class SellerMinInfo(BaseModel):
    id: str
    store_name: str
    email: EmailStr

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_seconds: int = 300
    seller: SellerMinInfo


# Product Schemas
class ProductCreate(BaseModel):
    brand: str = Field(..., min_length=1, max_length=100)
    model: str = Field(..., min_length=1, max_length=255)
    processor: str = Field(..., min_length=1, max_length=150)
    ram: str = Field(..., min_length=1, max_length=50)
    storage: str = Field(..., min_length=1, max_length=100)
    gpu: str = Field(..., min_length=1, max_length=150)
    screen_size: str = Field(..., min_length=1, max_length=50)
    condition: str = Field(..., min_length=1, max_length=30)  # New, Refurbished, Used
    price: float = Field(..., ge=0.0)
    stock_quantity: int = Field(..., ge=0)

    @field_validator("condition")
    @classmethod
    def validate_condition(cls, v: str) -> str:
        allowed = ["New", "Refurbished", "Used"]
        # Case-insensitive check but store as capitalized
        for a in allowed:
            if v.lower() == a.lower():
                return a
        raise ValueError("Condition must be 'New', 'Refurbished', or 'Used'")


class ProductUpdate(ProductCreate):
    pass


class ProductResponse(BaseModel):
    id: str
    seller_id: str
    brand: str
    model: str
    processor: str
    ram: str
    storage: str
    gpu: str
    screen_size: str
    condition: str
    price: float
    stock_quantity: int
    is_low_stock: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

    @field_validator("price", mode="before")
    @classmethod
    def convert_numeric_to_float(cls, v):
        if v is not None:
            return float(v)
        return v


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    skip: int
    limit: int
