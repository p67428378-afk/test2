from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List

from server.database import get_db
from server.schemas.shopping_list import ShoppingList, ShoppingListCreate
from server.crud import shopping_list as crud_shopping_list
from server.schemas.recipe import Ingredient

router = APIRouter()

@router.post("/", response_model=ShoppingList)
def create_shopping_list(shopping_list: ShoppingListCreate, db: Session = Depends(get_db)):
    # This is a placeholder for the actual shopping list generation logic.
    # For now, we'll just create a shopping list with some dummy data.
    dummy_ingredients = [
        {"name": "Chicken Breast", "quantity": 1.5, "unit": "lbs"},
        {"name": "Broccoli", "quantity": 2, "unit": "heads"},
        {"name": "Quinoa", "quantity": 1, "unit": "cup"},
        {"name": "Olive Oil", "quantity": 1, "unit": "bottle"},
        {"name": "Eggs", "quantity": 1, "unit": "dozen"},
    ]
    db_shopping_list = crud_shopping_list.create_shopping_list(db=db, shopping_list=shopping_list, ingredients=dummy_ingredients)
    return db_shopping_list

@router.get("/{meal_plan_id}", response_model=ShoppingList)
def read_shopping_list(meal_plan_id: uuid.UUID, db: Session = Depends(get_db)):
    shopping_list = crud_shopping_list.get_shopping_list_by_meal_plan(db, meal_plan_id=meal_plan_id)
    if not shopping_list:
        raise HTTPException(status_code=404, detail="Shopping list not found for the given meal plan.")
    return shopping_list
