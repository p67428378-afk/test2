import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Module, StudentProgress, User
from server.schemas import (
    ProgressCreateRequest,
    ProgressResponse,
    ProgressSummaryResponse,
)
from server.auth import get_optional_current_user

router = APIRouter(
    prefix="/api/v1/progress", tags=["Student Progress & Self-Assessment"]
)


@router.post("", response_model=ProgressResponse, status_code=status.HTTP_200_OK)
def record_progress(
    progress_in: ProgressCreateRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    # UUID format is pre-validated by Pydantic validator on ProgressCreateRequest (raises 422 if invalid)
    module = db.query(Module).filter(Module.id == progress_in.module_id).first()
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Module with ID '{progress_in.module_id}' not found",
        )

    # Determine user_id
    user_id = progress_in.user_id
    if not user_id and current_user:
        user_id = current_user.id
    if not user_id:
        # Fallback to default test student user if available
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if test_user:
            user_id = test_user.id

    # Check for existing progress for this user & module
    existing_prog = None
    if user_id:
        existing_prog = (
            db.query(StudentProgress)
            .filter(
                StudentProgress.user_id == user_id,
                StudentProgress.module_id == progress_in.module_id,
            )
            .first()
        )
    else:
        existing_prog = (
            db.query(StudentProgress)
            .filter(StudentProgress.module_id == progress_in.module_id)
            .first()
        )

    comp_time = progress_in.completed_at or datetime.now(timezone.utc)
    is_completed = (progress_in.score >= 60) or (
        len(progress_in.completed_checkpoints or []) > 0
    )

    if existing_prog:
        existing_prog.score = progress_in.score
        # Merge checkpoints
        current_chks = set(existing_prog.completed_checkpoints or [])
        if progress_in.completed_checkpoints:
            current_chks.update(progress_in.completed_checkpoints)
        existing_prog.completed_checkpoints = list(current_chks)
        existing_prog.is_completed = is_completed or existing_prog.is_completed
        existing_prog.completed_at = comp_time
        db.commit()
        db.refresh(existing_prog)
        prog_record = existing_prog
    else:
        prog_record = StudentProgress(
            user_id=user_id,
            module_id=progress_in.module_id,
            score=progress_in.score,
            completed_checkpoints=progress_in.completed_checkpoints or [],
            is_completed=is_completed,
            completed_at=comp_time,
        )
        db.add(prog_record)
        db.commit()
        db.refresh(prog_record)

    return ProgressResponse(
        id=prog_record.id,
        status="recorded",
        progress_id=prog_record.id,
        module_id=prog_record.module_id,
        user_id=prog_record.user_id,
        score=prog_record.score,
        updated_total_score=prog_record.score,
        completed_checkpoints=prog_record.completed_checkpoints or [],
        is_completed=prog_record.is_completed,
        completed_at=prog_record.completed_at,
    )


@router.get("", response_model=List[ProgressResponse])
def list_progress(
    user_id: Optional[str] = Query(None),
    module_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(StudentProgress)
    if user_id:
        query = query.filter(StudentProgress.user_id == user_id)
    if module_id:
        query = query.filter(StudentProgress.module_id == module_id)

    records = query.order_by(StudentProgress.completed_at.desc()).all()
    return [
        ProgressResponse(
            id=r.id,
            status="recorded",
            progress_id=r.id,
            module_id=r.module_id,
            user_id=r.user_id,
            score=r.score,
            updated_total_score=r.score,
            completed_checkpoints=r.completed_checkpoints or [],
            is_completed=r.is_completed,
            completed_at=r.completed_at,
        )
        for r in records
    ]


@router.get("/summary", response_model=ProgressSummaryResponse)
def get_progress_summary(
    user_id: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    target_user_id = user_id or (current_user.id if current_user else None)
    if not target_user_id:
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if test_user:
            target_user_id = test_user.id

    total_modules = db.query(Module).count()
    query = db.query(StudentProgress)
    if target_user_id:
        query = query.filter(StudentProgress.user_id == target_user_id)

    progress_items = query.all()
    completed_modules = sum(1 for p in progress_items if p.is_completed)
    total_score = sum(p.score for p in progress_items)
    avg_score = round(total_score / len(progress_items), 1) if progress_items else 0.0

    all_checkpoints = set()
    for p in progress_items:
        if p.completed_checkpoints:
            all_checkpoints.update(p.completed_checkpoints)

    recent = [
        ProgressResponse(
            id=r.id,
            status="recorded",
            progress_id=r.id,
            module_id=r.module_id,
            user_id=r.user_id,
            score=r.score,
            updated_total_score=r.score,
            completed_checkpoints=r.completed_checkpoints or [],
            is_completed=r.is_completed,
            completed_at=r.completed_at,
        )
        for r in sorted(progress_items, key=lambda x: x.completed_at, reverse=True)[:10]
    ]

    return ProgressSummaryResponse(
        enrolled_modules=total_modules if total_modules > 0 else len(progress_items),
        completed_modules=completed_modules,
        average_score=avg_score,
        completed_checkpoints=len(all_checkpoints),
        recent_progress=recent,
    )


@router.get("/module/{module_id}", response_model=Optional[ProgressResponse])
def get_module_progress(
    module_id: str,
    user_id: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    try:
        uuid.UUID(str(module_id))
    except (ValueError, TypeError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid UUID format for module ID",
        )

    target_user_id = user_id or (current_user.id if current_user else None)
    if not target_user_id:
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if test_user:
            target_user_id = test_user.id

    query = db.query(StudentProgress).filter(StudentProgress.module_id == module_id)
    if target_user_id:
        query = query.filter(StudentProgress.user_id == target_user_id)

    record = query.first()
    if not record:
        return None

    return ProgressResponse(
        id=record.id,
        status="recorded",
        progress_id=record.id,
        module_id=record.module_id,
        user_id=record.user_id,
        score=record.score,
        updated_total_score=record.score,
        completed_checkpoints=record.completed_checkpoints or [],
        is_completed=record.is_completed,
        completed_at=record.completed_at,
    )
