from pydantic import BaseModel
import uuid
from typing import List
from .recipe import Ingredient

class ShoppingListBase(BaseModel):
    meal_plan_id: uuid.UUID

class ShoppingListCreate(ShoppingListBase):
    pass

class ShoppingList(ShoppingListBase):
    id: uuid.UUID
    ingredients: List[Ingredient]

    class Config:
        orm_mode = True
