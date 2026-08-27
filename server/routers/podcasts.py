"""Podcast API router endpoints."""

import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Episode, Podcast
from server.schemas import (
    EpisodeListResponse,
    Podcast as PodcastSchema,
    PodcastListResponse,
)

router = APIRouter(prefix="/api/v1/podcasts", tags=["podcasts"])


@router.get("", response_model=PodcastListResponse)
def list_podcasts(
    category: Optional[str] = Query(None, description="Filter by category tag"),
    search: Optional[str] = Query(
        None, description="Keyword search on title, author, or description"
    ),
    page: int = Query(1, ge=1, description="Page index"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    """List and search podcast shows with category filtering and pagination."""
    query = db.query(Podcast)

    # Category filter
    if (
        category
        and category.strip()
        and category.strip().lower() not in ("all", "all categories")
    ):
        query = query.filter(func.lower(Podcast.category) == category.strip().lower())

    # Search keyword filter
    if search and search.strip():
        term = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Podcast.title).like(term),
                func.lower(Podcast.author).like(term),
                func.lower(Podcast.description).like(term),
                func.lower(Podcast.category).like(term),
            )
        )

    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 0
    offset = (page - 1) * limit

    items = (
        query.order_by(Podcast.total_subscribers.desc(), Podcast.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return PodcastListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )


@router.get("/{id}", response_model=PodcastSchema)
def get_podcast(
    id: str,
    db: Session = Depends(get_db),
):
    """Get detailed metadata for a single podcast show."""
    podcast = db.query(Podcast).filter(Podcast.id == id).first()
    if not podcast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podcast show not found",
        )
    return podcast


@router.get("/{id}/episodes", response_model=EpisodeListResponse)
def get_podcast_episodes(
    id: str,
    page: int = Query(1, ge=1, description="Page index"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    """Get paginated list of episodes for a specific podcast show."""
    podcast = db.query(Podcast).filter(Podcast.id == id).first()
    if not podcast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podcast show not found",
        )

    query = db.query(Episode).filter(Episode.podcast_id == id)
    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 0
    offset = (page - 1) * limit

    items = (
        query.order_by(Episode.publish_date.desc(), Episode.episode_number.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return EpisodeListResponse(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )
