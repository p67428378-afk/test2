from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import UserPreference
from server.schemas import PreferenceCreate, PreferenceResponse

router = APIRouter(prefix="/api/v1/preferences", tags=["preferences"])


@router.post("", response_model=PreferenceResponse, status_code=status.HTTP_201_CREATED)
def create_or_update_preference(
    payload: PreferenceCreate,
    db: Session = Depends(get_db),
):
    if not payload.user_id or not payload.user_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id is required and cannot be empty",
        )

    if payload.min_price < 0 or payload.max_price < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prices cannot be negative",
        )

    if payload.min_price > payload.max_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="min_price cannot be greater than max_price",
        )

    existing_pref = (
        db.query(UserPreference)
        .filter(UserPreference.user_id == payload.user_id)
        .first()
    )

    if existing_pref:
        existing_pref.category_preferences = payload.category_preferences
        existing_pref.min_price = payload.min_price
        existing_pref.max_price = payload.max_price
        existing_pref.preferred_tags = payload.preferred_tags
        db.commit()
        db.refresh(existing_pref)
        return existing_pref
    else:
        new_pref = UserPreference(
            user_id=payload.user_id.strip(),
            category_preferences=payload.category_preferences,
            min_price=payload.min_price,
            max_price=payload.max_price,
            preferred_tags=payload.preferred_tags,
        )
        db.add(new_pref)
        db.commit()
        db.refresh(new_pref)
        return new_pref


@router.get("/{user_id}", response_model=PreferenceResponse)
def get_user_preference(
    user_id: str,
    db: Session = Depends(get_db),
):
    pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
    if not pref:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Preferences for user '{user_id}' not found",
        )
    return pref
