from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db, seed_data

router = APIRouter(prefix="/api/v1/profiles", tags=["profiles"])


def get_current_user(
    db: Session = Depends(get_db),
    x_user_email: Optional[str] = Header(None, alias="X-User-Email"),
) -> models.User:
    email = x_user_email if x_user_email else "test@example.com"
    user = crud.get_user_by_email(db, email)
    if not user:
        # Guarantee test user exists
        seed_data(db)
        user = crud.get_user_by_email(db, email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not authenticated",
            )
    return user


@router.get("/me", response_model=schemas.UserResponse)
def read_current_user_profile(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    """
    Fetch current user profile and skill lists (teach and learn skills).
    """
    return crud.get_user_profile(db, current_user.id)


@router.post(
    "/skills",
    response_model=schemas.UserSkillResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_user_skill(
    skill_data: schemas.UserSkillCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Add or update a skill (teach or learn) in user profile.
    """
    return crud.create_user_skill(db, current_user.id, skill_data)


@router.delete("/skills/{user_skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_user_skill(
    user_skill_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Remove a skill entry from user profile.
    Raises error if skill is currently tied to an active or pending exchange request.
    """
    crud.delete_user_skill(db, current_user.id, user_skill_id)
    return None
