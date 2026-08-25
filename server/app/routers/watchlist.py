import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server.app.database import get_db
from server.app.models.film import Film
from server.app.models.watchlist import WatchlistEntry
from server.app.models.user import User
from server.app.routers import get_current_user
from server.app.schemas.watchlist import (
    WatchlistCreate,
    WatchlistResponse,
    WatchlistDetailResponse,
)

router = APIRouter(prefix="/watchlist", tags=["watchlist"])


@router.get("", response_model=List[WatchlistDetailResponse])
def get_watchlist(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    entries = (
        db.query(WatchlistEntry).filter(WatchlistEntry.user_id == current_user.id).all()
    )
    return entries


@router.post("", response_model=WatchlistResponse, status_code=status.HTTP_201_CREATED)
def add_to_watchlist(
    payload: WatchlistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Check if film exists
    film = db.query(Film).filter(Film.id == payload.film_id).first()
    if not film:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Film not found"
        )

    # Check if already in watchlist
    existing = (
        db.query(WatchlistEntry)
        .filter(
            WatchlistEntry.user_id == current_user.id,
            WatchlistEntry.film_id == payload.film_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Film already in watchlist"
        )

    entry = WatchlistEntry(
        id=str(uuid.uuid4()), user_id=current_user.id, film_id=payload.film_id
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{film_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_watchlist(
    film_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = (
        db.query(WatchlistEntry)
        .filter(
            WatchlistEntry.user_id == current_user.id, WatchlistEntry.film_id == film_id
        )
        .first()
    )
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Film not in watchlist"
        )

    db.delete(entry)
    db.commit()
    return None
