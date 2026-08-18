from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    role: str
    created_at: datetime

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


# Category Schemas
class CategoryBase(BaseModel):
    name: str


class CategoryResponse(CategoryBase):
    id: str

    class Config:
        from_attributes = True


# Dietary Tag Schemas
class DietaryTagResponse(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True


# Ingredient Schemas
class RecipeIngredientItem(BaseModel):
    name: str
    quantity: str
    unit: Optional[str] = None


# Recipe Schemas
class RecipeCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    prep_time: int = Field(..., ge=0)
    cook_time: int = Field(..., ge=0)
    servings: int = Field(..., ge=1)
    instructions: str = Field(..., min_length=1)
    category_id: Optional[str] = None
    ingredients: List[RecipeIngredientItem] = []
    dietary_tag_ids: List[str] = []


class RecipeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    prep_time: Optional[int] = Field(None, ge=0)
    cook_time: Optional[int] = Field(None, ge=0)
    servings: Optional[int] = Field(None, ge=1)
    instructions: Optional[str] = Field(None, min_length=1)
    category_id: Optional[str] = None
    ingredients: Optional[List[RecipeIngredientItem]] = None
    dietary_tag_ids: Optional[List[str]] = None


class RecipeSummaryResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    prep_time: int
    cook_time: int
    servings: int
    category_name: Optional[str] = None
    dietary_tags: List[str] = []
    is_favorite: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


class RecipeDetailResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    prep_time: int
    cook_time: int
    servings: int
    instructions: str
    user_id: str
    category: Optional[CategoryResponse] = None
    ingredients: List[RecipeIngredientItem] = []
    dietary_tags: List[str] = []
    is_favorite: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
