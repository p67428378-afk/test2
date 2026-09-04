from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from server.database import get_db
from server.models import Subject
from server.schemas import (
    SubjectCreate,
    SubjectUpdate,
    SubjectResponse,
    SubjectDetailResponse,
    SubjectProgressResponse,
    TopicResponse,
)

router = APIRouter(prefix="/subjects", tags=["Subjects"])


def compute_subject_stats(subject: Subject):
    topics = subject.topics or []
    total = len(topics)
    completed = sum(1 for t in topics if t.status == "Completed")
    pct = round((completed / total * 100.0), 1) if total > 0 else 0.0
    return total, completed, pct


@router.post("", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
def create_subject(payload: SubjectCreate, db: Session = Depends(get_db)):
    subject = Subject(
        title=payload.title,
        description=payload.description,
        target_exam_date=payload.target_exam_date,
    )
    db.add(subject)
    db.commit()
    db.refresh(subject)
    total, completed, pct = compute_subject_stats(subject)
    return SubjectResponse(
        id=subject.id,
        title=subject.title,
        description=subject.description,
        target_exam_date=subject.target_exam_date,
        created_at=subject.created_at,
        updated_at=subject.updated_at,
        total_topics=total,
        completed_topics=completed,
        progress_percentage=pct,
    )


@router.get("", response_model=List[SubjectResponse])
def list_subjects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    subjects = (
        db.query(Subject)
        .options(joinedload(Subject.topics))
        .order_by(Subject.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    result = []
    for s in subjects:
        total, completed, pct = compute_subject_stats(s)
        result.append(
            SubjectResponse(
                id=s.id,
                title=s.title,
                description=s.description,
                target_exam_date=s.target_exam_date,
                created_at=s.created_at,
                updated_at=s.updated_at,
                total_topics=total,
                completed_topics=completed,
                progress_percentage=pct,
            )
        )
    return result


@router.get("/{subject_id}", response_model=SubjectDetailResponse)
def get_subject(subject_id: str, db: Session = Depends(get_db)):
    subject = (
        db.query(Subject)
        .options(joinedload(Subject.topics))
        .filter(Subject.id == subject_id)
        .first()
    )
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with id '{subject_id}' not found",
        )
    total, completed, pct = compute_subject_stats(subject)
    topics_response = [
        TopicResponse.model_validate(t)
        for t in sorted(subject.topics, key=lambda x: x.created_at)
    ]
    return SubjectDetailResponse(
        id=subject.id,
        title=subject.title,
        description=subject.description,
        target_exam_date=subject.target_exam_date,
        created_at=subject.created_at,
        updated_at=subject.updated_at,
        total_topics=total,
        completed_topics=completed,
        progress_percentage=pct,
        topics=topics_response,
    )


@router.get("/{subject_id}/progress", response_model=SubjectProgressResponse)
def get_subject_progress(subject_id: str, db: Session = Depends(get_db)):
    subject = (
        db.query(Subject)
        .options(joinedload(Subject.topics))
        .filter(Subject.id == subject_id)
        .first()
    )
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with id '{subject_id}' not found",
        )
    total, completed, pct = compute_subject_stats(subject)
    return SubjectProgressResponse(
        subject_id=subject.id,
        title=subject.title,
        total_topics=total,
        completed_topics=completed,
        progress_percentage=pct,
    )


@router.put("/{subject_id}", response_model=SubjectResponse)
def update_subject(
    subject_id: str,
    payload: SubjectUpdate,
    db: Session = Depends(get_db),
):
    subject = (
        db.query(Subject)
        .options(joinedload(Subject.topics))
        .filter(Subject.id == subject_id)
        .first()
    )
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with id '{subject_id}' not found",
        )

    if payload.title is not None:
        subject.title = payload.title
    if payload.description is not None:
        subject.description = payload.description
    if payload.target_exam_date is not None:
        subject.target_exam_date = payload.target_exam_date

    db.commit()
    db.refresh(subject)
    total, completed, pct = compute_subject_stats(subject)
    return SubjectResponse(
        id=subject.id,
        title=subject.title,
        description=subject.description,
        target_exam_date=subject.target_exam_date,
        created_at=subject.created_at,
        updated_at=subject.updated_at,
        total_topics=total,
        completed_topics=completed,
        progress_percentage=pct,
    )


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(subject_id: str, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subject with id '{subject_id}' not found",
        )
    db.delete(subject)
    db.commit()
    return None
