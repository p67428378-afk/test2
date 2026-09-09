"""User preference management endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import UserPreference
from server.schemas import UserPreferenceCreate, UserPreferenceResponse

router = APIRouter()


@router.post(
    "", response_model=UserPreferenceResponse, status_code=status.HTTP_201_CREATED
)
@router.post(
    "/",
    response_model=UserPreferenceResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def save_user_preferences(
    payload: UserPreferenceCreate,
    db: Session = Depends(get_db),
):
    """
    Save or update user preference profile (categories, price constraints, preferred tags).
    """
    if payload.user_id is None or not payload.user_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id is required and cannot be empty",
        )

    user_id = payload.user_id.strip()

    if payload.min_price < 0 or payload.max_price < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Price bounds must be non-negative",
        )

    if payload.min_price > payload.max_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="min_price cannot exceed max_price",
        )

    # Validate that at least some preference or non-zero price is provided
    if (
        not payload.category_preferences
        and not payload.preferred_tags
        and payload.min_price == 0
        and payload.max_price == 0
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Preference payload cannot be empty",
        )

    pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
    if pref:
        pref.category_preferences = payload.category_preferences
        pref.min_price = payload.min_price
        pref.max_price = payload.max_price
        pref.preferred_tags = payload.preferred_tags
    else:
        pref = UserPreference(
            user_id=user_id,
            category_preferences=payload.category_preferences,
            min_price=payload.min_price,
            max_price=payload.max_price,
            preferred_tags=payload.preferred_tags,
        )
        db.add(pref)

    db.commit()
    db.refresh(pref)
    return pref


@router.get("/{user_id}", response_model=UserPreferenceResponse)
def get_user_preferences(
    user_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve the active preference profile for a given user."""
    if not user_id or not user_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id cannot be empty",
        )
    pref = (
        db.query(UserPreference)
        .filter(UserPreference.user_id == user_id.strip())
        .first()
    )
    if not pref:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Preferences for user {user_id} not found",
        )
    return pref
