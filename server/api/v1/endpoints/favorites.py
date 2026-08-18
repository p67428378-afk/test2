from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user
from server import crud

router = APIRouter()


@router.post("/{user_id}/favorites/{recipe_id}", status_code=status.HTTP_200_OK)
def add_recipe_to_favorites(
    user_id: str,
    recipe_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify favorites for this user",
        )

    recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    crud.add_favorite(db, user=current_user, recipe=recipe)
    return {"detail": "Recipe added to favorites"}


@router.delete("/{user_id}/favorites/{recipe_id}", status_code=status.HTTP_200_OK)
def remove_recipe_from_favorites(
    user_id: str,
    recipe_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify favorites for this user",
        )

    recipe = crud.get_recipe(db, recipe_id=recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found"
        )

    crud.remove_favorite(db, user=current_user, recipe=recipe)
    return {"detail": "Recipe removed from favorites"}
