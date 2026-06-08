from pydantic import BaseModel
import uuid
from typing import List, Optional

class Ingredient(BaseModel):
    name: str
    quantity: float
    unit: str

class RecipeBase(BaseModel):
    name: str
    description: Optional[str] = None
    preparation_tips: Optional[str] = None
    ingredients: List[Ingredient]

class RecipeCreate(RecipeBase):
    pass

class Recipe(RecipeBase):
    id: uuid.UUID

    class Config:
        orm_mode = True
