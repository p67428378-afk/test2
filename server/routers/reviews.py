from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import ResearchNote, Review, User
from server.schemas import NoteOut, ReviewOut, ReviewCreate
from server.auth import get_current_expert

router = APIRouter(prefix="/reviews", tags=["Expert Validation"])


@router.get("/pending", response_model=List[NoteOut])
@router.get("/queue", response_model=List[NoteOut])
def get_pending_review_queue(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_expert: User = Depends(get_current_expert),
):
    notes = (
        db.query(ResearchNote)
        .filter(ResearchNote.status == "PENDING")
        .order_by(ResearchNote.created_at.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return notes


@router.get("/notes/{note_id}", response_model=List[ReviewOut])
def get_reviews_for_note(note_id: str, db: Session = Depends(get_db)):
    note = db.query(ResearchNote).filter(ResearchNote.id == note_id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Research note with id {note_id} not found.",
        )
    return note.reviews


@router.post("/{note_id}/approve", response_model=NoteOut)
@router.post("/notes/{note_id}/approve", response_model=NoteOut)
def approve_review(
    note_id: str,
    review_in: Optional[ReviewCreate] = Body(None),
    db: Session = Depends(get_db),
    current_expert: User = Depends(get_current_expert),
):
    note = db.query(ResearchNote).filter(ResearchNote.id == note_id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Research note with id {note_id} not found.",
        )

    note.status = "APPROVED"
    feedback_text = (
        review_in.feedback if review_in and review_in.feedback else "Approved by expert"
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


@router.post("/{note_id}/reject", response_model=NoteOut)
@router.post("/notes/{note_id}/reject", response_model=NoteOut)
def reject_review(
    note_id: str,
    review_in: ReviewCreate = Body(...),
    db: Session = Depends(get_db),
    current_expert: User = Depends(get_current_expert),
):
    if not review_in or not review_in.feedback or not review_in.feedback.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mandatory feedback is required when rejecting a research note.",
        )

    note = db.query(ResearchNote).filter(ResearchNote.id == note_id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Research note with id {note_id} not found.",
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
