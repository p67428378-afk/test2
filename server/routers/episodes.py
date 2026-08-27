"""Episode API router endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Episode
from server.schemas import Episode as EpisodeSchema

router = APIRouter(prefix="/api/v1/episodes", tags=["episodes"])


@router.get("/{id}", response_model=EpisodeSchema)
def get_episode(
    id: str,
    db: Session = Depends(get_db),
):
    """Get detailed metadata for a single episode."""
    episode = db.query(Episode).filter(Episode.id == id).first()
    if not episode:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Episode not found",
        )
    return episode
