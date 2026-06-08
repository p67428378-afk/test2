from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid

from server.database import get_db
from server.schemas.recipe import Recipe
from server.crud import recipe as crud_recipe

router = APIRouter()

@router.get("/{recipe_id}", response_model=Recipe)
def read_recipe(recipe_id: uuid.UUID, db: Session = Depends(get_db)):
    db_recipe = crud_recipe.get_recipe(db, recipe_id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe
