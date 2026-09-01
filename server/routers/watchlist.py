from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas
from server.services.watchlist_service import screen_national_id

router = APIRouter(prefix="/api/v1/watchlist", tags=["Security Watchlist"])


@router.get("", response_model=List[schemas.WatchlistResponse])
def list_watchlist_entries(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db),
):
    query = db.query(models.WatchlistEntry)
    if is_active is not None:
        query = query.filter(models.WatchlistEntry.is_active == is_active)
    if search:
        query = query.filter(
            (models.WatchlistEntry.national_id.ilike(f"%{search}%"))
            | (models.WatchlistEntry.full_name.ilike(f"%{search}%"))
            | (models.WatchlistEntry.reason.ilike(f"%{search}%"))
        )
    return (
        query.order_by(models.WatchlistEntry.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post(
    "", response_model=schemas.WatchlistResponse, status_code=status.HTTP_201_CREATED
)
def add_to_watchlist(entry_in: schemas.WatchlistCreate, db: Session = Depends(get_db)):
    clean_id = entry_in.national_id.strip().upper()
    existing = (
        db.query(models.WatchlistEntry)
        .filter(
            models.WatchlistEntry.national_id.ilike(clean_id),
            models.WatchlistEntry.is_active.is_(True),
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An active watchlist entry already exists for this National ID",
        )

    entry = models.WatchlistEntry(
        national_id=clean_id,
        full_name=entry_in.full_name.strip(),
        reason=entry_in.reason.strip(),
        severity_level=entry_in.severity_level.upper(),
        flagged_by=entry_in.flagged_by or "SYSTEM",
        is_active=entry_in.is_active,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    # Automatically update existing visitor flag if matching
    matching_visitors = (
        db.query(models.Visitor)
        .filter(models.Visitor.national_id.ilike(clean_id))
        .all()
    )
    for v in matching_visitors:
        v.is_watchlist_flagged = True
    if matching_visitors:
        db.commit()

    return entry


@router.post("/screen", response_model=schemas.WatchlistScreenResponse)
def screen_visitor(
    screen_req: schemas.WatchlistScreenRequest, db: Session = Depends(get_db)
):
    clean_id = screen_req.national_id.strip().upper()
    is_flagged, entry = screen_national_id(db, clean_id, screen_req.full_name)

    if is_flagged and entry:
        return {
            "is_flagged": True,
            "national_id": clean_id,
            "match_details": entry,
            "message": f"MATCH FOUND: Flagged as {entry.severity_level} risk ({entry.reason})",
        }

    return {
        "is_flagged": False,
        "national_id": clean_id,
        "match_details": None,
        "message": "CLEARED: No matching security watchlist entries found",
    }


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_watchlist(entry_id: str, db: Session = Depends(get_db)):
    entry = (
        db.query(models.WatchlistEntry)
        .filter(models.WatchlistEntry.id == entry_id)
        .first()
    )
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist entry not found"
        )

    entry.is_active = False
    db.commit()
    return None
