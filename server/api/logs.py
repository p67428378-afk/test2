from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import StudyLog, Topic
from server.schemas import StudyLogCreate, StudyLogResponse

router = APIRouter(prefix="/study-logs", tags=["Study Logs"])


@router.post("", response_model=StudyLogResponse, status_code=status.HTTP_201_CREATED)
def create_study_log(payload: StudyLogCreate, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == payload.topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topic with id '{payload.topic_id}' not found",
        )

    log_entry = StudyLog(
        topic_id=payload.topic_id,
        session_minutes=payload.session_minutes,
        notes=payload.notes,
        logged_at=payload.logged_at or datetime.now(timezone.utc),
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry


@router.get("", response_model=List[StudyLogResponse])
def list_study_logs(
    topic_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    query = db.query(StudyLog)
    if topic_id:
        query = query.filter(StudyLog.topic_id == topic_id)
    logs = query.order_by(StudyLog.logged_at.desc()).offset(skip).limit(limit).all()
    return logs


@router.get("/{log_id}", response_model=StudyLogResponse)
def get_study_log(log_id: str, db: Session = Depends(get_db)):
    log_entry = db.query(StudyLog).filter(StudyLog.id == log_id).first()
    if not log_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Study log with id '{log_id}' not found",
        )
    return log_entry


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_study_log(log_id: str, db: Session = Depends(get_db)):
    log_entry = db.query(StudyLog).filter(StudyLog.id == log_id).first()
    if not log_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Study log with id '{log_id}' not found",
        )
    db.delete(log_entry)
    db.commit()
    return None
