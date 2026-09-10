from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import ResearchNote, Tag, Citation, Review, User
from server.schemas import NoteCreate, NoteOut, ReviewCreate
from server.auth import get_current_user, get_current_expert

router = APIRouter(prefix="/notes", tags=["Research Notes"])


@router.post("", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(
    note_in: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note = ResearchNote(
        title=note_in.title,
        body=note_in.body,
        category=note_in.category or "General",
        status="PENDING",
        author_id=current_user.id if hasattr(current_user, "id") else None,
    )
    db.add(note)
    db.flush()

    # Process tags
    if note_in.tags:
        for tag_name in note_in.tags:
            tag_name_clean = tag_name.strip()
            if not tag_name_clean:
                continue
            tag = db.query(Tag).filter(Tag.name == tag_name_clean).first()
            if not tag:
                tag = Tag(name=tag_name_clean)
                db.add(tag)
                db.flush()
            note.tags.append(tag)

    # Process citations
    if note_in.citations:
        for cit in note_in.citations:
            citation = Citation(
                note_id=note.id,
                title=cit.title,
                url=cit.url,
                citation_type=cit.citation_type or "EXTERNAL",
            )
            db.add(citation)

    db.commit()
    db.refresh(note)
    return note


@router.get("", response_model=List[NoteOut])
@router.get("/", response_model=List[NoteOut])
def get_notes(
    status: Optional[str] = None,
    category: Optional[str] = None,
    author_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(ResearchNote)
    if status:
        query = query.filter(ResearchNote.status == status.upper())
    if category:
        query = query.filter(ResearchNote.category == category)
    if author_id:
        query = query.filter(ResearchNote.author_id == author_id)

    notes = (
        query.order_by(ResearchNote.created_at.desc()).offset(skip).limit(limit).all()
    )
    return notes


@router.get("/{id}", response_model=NoteOut)
def get_note(id: str, db: Session = Depends(get_db)):
    note = db.query(ResearchNote).filter(ResearchNote.id == id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Research note with id {id} not found.",
        )
    return note


@router.post("/{id}/approve", response_model=NoteOut)
def approve_note(
    id: str,
    review_in: Optional[ReviewCreate] = Body(None),
    db: Session = Depends(get_db),
    current_expert: User = Depends(get_current_expert),
):
    note = db.query(ResearchNote).filter(ResearchNote.id == id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Research note with id {id} not found.",
        )

    note.status = "APPROVED"
    feedback_text = (
        review_in.feedback if review_in and review_in.feedback else "Approved"
    )

    review = Review(
        note_id=note.id,
        reviewer_id=current_expert.id if hasattr(current_expert, "id") else None,
        action="APPROVE",
        feedback=feedback_text,
    )
    db.add(review)
    db.commit()
    db.refresh(note)
    return note


@router.post("/{id}/reject", response_model=NoteOut)
def reject_note(
    id: str,
    review_in: ReviewCreate = Body(...),
    db: Session = Depends(get_db),
    current_expert: User = Depends(get_current_expert),
):
    if not review_in or not review_in.feedback or not review_in.feedback.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mandatory feedback is required when rejecting a research note.",
        )

    note = db.query(ResearchNote).filter(ResearchNote.id == id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Research note with id {id} not found.",
        )

    note.status = "REJECTED"

    review = Review(
        note_id=note.id,
        reviewer_id=current_expert.id if hasattr(current_expert, "id") else None,
        action="REJECT",
        feedback=review_in.feedback,
    )
    db.add(review)
    db.commit()
    db.refresh(note)
    return note
