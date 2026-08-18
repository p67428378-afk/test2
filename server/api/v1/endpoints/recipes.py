from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from jose import jwt, JWTError
from server.database import get_db
from server.core.config import settings
from server.api.v1.endpoints.auth import get_current_user
from server.schemas import (
    RecipeCreate,
    RecipeUpdate,
    RecipeSummaryResponse,
    RecipeDetailResponse,
    RecipeIngredientItem,
    CategoryResponse,
)
from server import crud

router = APIRouter()


def get_current_user_optional(
    db: Session = Depends(get_db), authorization: Optional[str] = Header(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email:
            return crud.get_user_by_email(db, email=email)
    except JWTError:
        pass
    return None


@router.post(
    "", response_model=RecipeDetailResponse, status_code=status.HTTP_201_CREATED
)
def create_new_recipe(
    recipe_in: RecipeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    recipe = crud.create_recipe(db, recipe_in=recipe_in, user_id=current_user.id)

    # Map to response
    return RecipeDetailResponse(
        id=recipe.id,
        title=recipe.title,
        description=recipe.description,
        prep_time=recipe.prep_time,
        cook_time=recipe.cook_time,
        servings=recipe.servings,
        instructions=recipe.instructions,
        user_id=recipe.user_id,
        category=CategoryResponse.model_validate(recipe.category)
        if recipe.category
        else None,
        ingredients=[
            RecipeIngredientItem(
                name=assoc.ingredient.name, quantity=assoc.quantity, unit=assoc.unit
            )
            for assoc in recipe.ingredient_associations
        ],
        dietary_tags=[tag.name for tag in recipe.dietary_tags],
        is_favorite=recipe in current_user.favorite_recipes,
        created_at=recipe.created_at,
        updated_at=recipe.updated_at,
    )


@router.get("", response_model=List[RecipeSummaryResponse])
def list_recipes(
    search: Optional[str] = None,
    category_id: Optional[str] = None,
    dietary_tags: Optional[List[str]] = Query(None),
    max_prep_time: Optional[int] = None,
    max_cook_time: Optional[int] = None,
    ingredients: Optional[List[str]] = Query(None),
    favorites_only: bool = False,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    user_id = current_user.id if current_user else None
    recipes = crud.get_recipes(
        db,
        user_id=user_id,
        search=search,
        category_id=category_id,
        dietary_tags=dietary_tags,
        max_prep_time=max_prep_time,
        max_cook_time=max_cook_time,
        ingredients=ingredients,
        favorites_only=favorites_only,
    )

    response = []
    for r in recipes:
        is_fav = False
        if current_user:
            is_fav = r in current_user.favorite_recipes

        response.append(
            RecipeSummaryResponse(
                id=r.id,
                title=r.title,
                description=r.description,
                prep_time=r.prep_time,
                cook_time=r.cook_time,
                servings=r.servings,
                category_name=r.category.name if r.category else None,
                dietary_tags=[tag.name for tag in r.dietary_tags],
                is_favorite=is_fav,
                created_at=r.created_at,
            )
        )
    return response


@router.get("/{id}", response_model=RecipeDetailResponse)
def get_recipe_by_id(
    id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    recipe = crud.get_recipe(db, recipe_id=id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    is_fav = False
    if current_user:
        is_fav = recipe in current_user.favorite_recipes

    return RecipeDetailResponse(
        id=recipe.id,
        title=recipe.title,
        description=recipe.description,
        prep_time=recipe.prep_time,
        cook_time=recipe.cook_time,
        servings=recipe.servings,
        instructions=recipe.instructions,
        user_id=recipe.user_id,
        category=CategoryResponse.model_validate(recipe.category)
        if recipe.category
        else None,
        ingredients=[
            RecipeIngredientItem(
                name=assoc.ingredient.name, quantity=assoc.quantity, unit=assoc.unit
            )
            for assoc in recipe.ingredient_associations
        ],
        dietary_tags=[tag.name for tag in recipe.dietary_tags],
        is_favorite=is_fav,
        created_at=recipe.created_at,
        updated_at=recipe.updated_at,
    )


@router.put("/{id}", response_model=RecipeDetailResponse)
def update_recipe_by_id(
    id: str,
    recipe_in: RecipeUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    recipe = crud.get_recipe(db, recipe_id=id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    if recipe.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this recipe",
        )

    updated_recipe = crud.update_recipe(db, db_recipe=recipe, recipe_in=recipe_in)

    return RecipeDetailResponse(
        id=updated_recipe.id,
        title=updated_recipe.title,
        description=updated_recipe.description,
        prep_time=updated_recipe.prep_time,
        cook_time=updated_recipe.cook_time,
        servings=updated_recipe.servings,
        instructions=updated_recipe.instructions,
        user_id=updated_recipe.user_id,
        category=CategoryResponse.model_validate(updated_recipe.category)
        if updated_recipe.category
        else None,
        ingredients=[
            RecipeIngredientItem(
                name=assoc.ingredient.name, quantity=assoc.quantity, unit=assoc.unit
            )
            for assoc in updated_recipe.ingredient_associations
        ],
        dietary_tags=[tag.name for tag in updated_recipe.dietary_tags],
        is_favorite=updated_recipe in current_user.favorite_recipes,
        created_at=updated_recipe.created_at,
        updated_at=updated_recipe.updated_at,
    )


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe_by_id(
    id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    recipe = crud.get_recipe(db, recipe_id=id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    if recipe.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this recipe",
        )

    crud.delete_recipe(db, db_recipe=recipe)
    return None
