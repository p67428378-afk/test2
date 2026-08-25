from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    color: Optional[str] = Field(default="#3B82F6", max_length=20)
    icon: Optional[str] = Field(default="tag", max_length=50)

    @field_validator("name")
    @classmethod
    def validate_name_not_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Category name cannot be blank")
        return v.strip()


class CategoryCreate(CategoryBase):
    color: str = Field(default="#3B82F6", max_length=20)
    icon: str = Field(default="tag", max_length=50)


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    color: Optional[str] = Field(None, max_length=20)
    icon: Optional[str] = Field(None, max_length=50)

    @field_validator("name")
    @classmethod
    def validate_name_not_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            if not v or not v.strip():
                raise ValueError("Category name cannot be blank")
            return v.strip()
        return v


class CategoryResponse(BaseModel):
    id: str
    name: str
    color: str
    icon: str
    is_default: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
