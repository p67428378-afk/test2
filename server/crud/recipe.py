from sqlalchemy.orm import Session
import uuid
from server.models.recipe import Recipe
from server.schemas.recipe import RecipeCreate

def get_recipe(db: Session, recipe_id: uuid.UUID):
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()

def get_recipes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Recipe).offset(skip).limit(limit).all()

def create_recipe(db: Session, recipe: RecipeCreate):
    db_recipe = Recipe(**recipe.dict())
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe
