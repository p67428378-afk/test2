from pydantic import BaseModel
import uuid
from typing import List, Optional
from datetime import date

class Meal(BaseModel):
    date: date
    day_of_week: str
    recipe_id: uuid.UUID
    recipe_name: str

class MealPlanBase(BaseModel):
    user_id: uuid.UUID
    start_date: date
    end_date: date

class MealPlanCreate(BaseModel):
    user_id: str
    cooking_time: int
    dietary_goals: List[str]
    preferences: List[str]


class MealPlan(MealPlanBase):
    id: uuid.UUID
    meals: List[Meal]

    class Config:
        orm_mode = True

class MealPlanInDB(MealPlanBase):
    id: uuid.UUID

    class Config:
        orm_mode = True
