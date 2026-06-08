from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import List

from server.database import get_db
from server.schemas.user import UserPreference, UserPreferenceUpdate
from server.crud import user as crud_user

router = APIRouter()

@router.get("/{user_id}/preferences", response_model=UserPreference)
def read_user_preferences(user_id: uuid.UUID, db: Session = Depends(get_db)):
    preferences = crud_user.get_user_preferences(db, user_id=user_id)
    if not preferences:
        raise HTTPException(status_code=404, detail="User not found")
    return preferences

@router.put("/{user_id}/preferences", response_model=UserPreference)
def update_user_preferences(user_id: uuid.UUID, preferences: UserPreferenceUpdate, db: Session = Depends(get_db)):
    db_preferences = crud_user.update_user_preferences(db, user_id=user_id, preferences=preferences)
    if not db_preferences:
        raise HTTPException(status_code=404, detail="User not found")
    return db_preferences
