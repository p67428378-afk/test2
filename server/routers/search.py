from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server.models import ResearchNote, Tag
from server.schemas import NoteOut

router = APIRouter(prefix="/search", tags=["Search & Knowledge Base"])


@router.get("", response_model=List[NoteOut])
@router.get("/", response_model=List[NoteOut])
def search_knowledge_base(
    q: Optional[str] = Query(
        None, description="Full-text search query for title or body"
    ),
    tag: Optional[str] = Query(None, description="Filter by tag name"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(
        "APPROVED", description="Filter by note status (default: APPROVED)"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(ResearchNote)

    # Tag filter
    if tag and tag.strip():
        query = query.join(ResearchNote.tags).filter(
            or_(Tag.name.ilike(f"%{tag.strip()}%"), Tag.id == tag.strip())
        )

    # Filter by status if specified (default APPROVED)
    if status and status.upper() != "ALL":
        query = query.filter(ResearchNote.status == status.upper())

    # Filter by category
    if category:
        query = query.filter(ResearchNote.category == category)

    # Search term filter in title or body
    if q and q.strip():
        search_pattern = f"%{q.strip()}%"
        query = query.filter(
            or_(
                ResearchNote.title.ilike(search_pattern),
                ResearchNote.body.ilike(search_pattern),
            )
        )

    notes = (
        query.distinct()
        .order_by(ResearchNote.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return notes
