from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from server.database import get_db
from server.schemas import MatchResponse
from server.security import get_current_active_user
from server.ai_matching import get_matches_for_item
from server.crud import get_item

router = APIRouter(prefix="/api/v1/items", tags=["matches"])


@router.get("/{item_id}/matches", response_model=List[MatchResponse])
def get_item_matches(
    item_id: str,
    threshold: float = Query(60.0, ge=0.0, le=100.0),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    db_item = get_item(db, item_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found."
        )

    matches = get_matches_for_item(db, db_item, threshold=threshold)
    return matches
