from sqlalchemy.orm import Session
import uuid
from server.models.shopping_list import ShoppingList
from server.schemas.shopping_list import ShoppingListCreate
from typing import List, Dict

def get_shopping_list_by_meal_plan(db: Session, meal_plan_id: uuid.UUID):
    return db.query(ShoppingList).filter(ShoppingList.meal_plan_id == meal_plan_id).first()

def create_shopping_list(db: Session, shopping_list: ShoppingListCreate, ingredients: List[Dict]):
    db_shopping_list = ShoppingList(
        meal_plan_id=shopping_list.meal_plan_id,
        ingredients=ingredients
    )
    db.add(db_shopping_list)
    db.commit()
    db.refresh(db_shopping_list)
    return db_shopping_list
