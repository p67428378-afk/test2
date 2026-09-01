from typing import Optional, Tuple
from sqlalchemy.orm import Session
from server import models


def screen_national_id(
    db: Session, national_id: str, full_name: Optional[str] = None
) -> Tuple[bool, Optional[models.WatchlistEntry]]:
    """
    Screens a national_id and optional full_name against active watchlist entries.
    Returns (is_flagged, matching_entry).
    """
    clean_id = national_id.strip().upper()

    # 1. Exact or case-insensitive match on national_id
    entry = (
        db.query(models.WatchlistEntry)
        .filter(
            models.WatchlistEntry.is_active.is_(True),
            models.WatchlistEntry.national_id.ilike(clean_id),
        )
        .first()
    )

    if entry:
        return True, entry

    # 2. Match on full_name if provided
    if full_name and len(full_name.strip()) > 3:
        clean_name = full_name.strip().lower()
        entry_by_name = (
            db.query(models.WatchlistEntry)
            .filter(
                models.WatchlistEntry.is_active.is_(True),
                models.WatchlistEntry.full_name.ilike(f"%{clean_name}%"),
            )
            .first()
        )
        if entry_by_name:
            return True, entry_by_name

    return False, None
