import uuid
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import crud, schemas
from server.services.ai_matching import find_potential_matches

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post(
    "/items", response_model=schemas.ItemResponse, status_code=status.HTTP_201_CREATED
)
def report_item(item_in: schemas.ItemCreate, db: Session = Depends(get_db)):
    try:
        item = crud.create_item(db, item_in)

        # Trigger backend process to find potential matches (AC 9)
        matches = find_potential_matches(db, item)

        # Notify the user who reported the item of potential matches (AC 11)
        if matches:
            match_names = ", ".join([m["item"].name for m in matches[:3]])
            notification_msg = (
                f"Notification sent to {item.contact_info}: "
                f"We found {len(matches)} potential matches for your reported item '{item.name}'! "
                f"Top matches: {match_names}."
            )
            logger.info(notification_msg)
            print(notification_msg)  # Ensure it appears in stdout/logs

        return item
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/items", response_model=List[schemas.ItemResponse])
def list_items(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1),
    db: Session = Depends(get_db),
):
    if status and status not in ("lost", "found"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be either 'lost' or 'found'",
        )
    return crud.list_items(db, category=category, status=status, skip=skip, limit=limit)


@router.get("/items/{item_id}", response_model=schemas.ItemResponse)
def get_item(item_id: uuid.UUID, db: Session = Depends(get_db)):
    item = crud.get_item(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return item


@router.get("/items/{item_id}/matches", response_model=List[schemas.MatchResponse])
def get_item_matches(item_id: uuid.UUID, db: Session = Depends(get_db)):
    item = crud.get_item(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    matches = find_potential_matches(db, item)
    return matches
