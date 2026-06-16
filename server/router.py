from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas, database

router = APIRouter()

@router.get("/recipes", response_model=List[schemas.RecipeListSchema])
def read_recipes(skip: int = 0, limit: int = 20, db: Session = Depends(database.get_db)):
    try:
        recipes = crud.get_recipes(db, skip=skip, limit=limit)
        return recipes
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/recipes/{recipe_id}", response_model=schemas.RecipeDetailSchema)
def read_recipe(recipe_id: str, db: Session = Depends(database.get_db)):
    try:
        recipe = crud.get_recipe(db, recipe_id=recipe_id)
        if recipe is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        return recipe
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
