from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Topic, Subject
from server.schemas import TopicCreate, TopicUpdate, TopicStatusUpdate, TopicResponse

router = APIRouter(prefix="/topics", tags=["Topics"])


@router.post("", response_model=TopicResponse, status_code=status.HTTP_201_CREATED)
def create_topic(payload: TopicCreate, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == payload.subject_id).first()
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parent subject with id '{payload.subject_id}' not found",
        )

    topic = Topic(
        subject_id=payload.subject_id,
        title=payload.title,
        estimated_minutes=payload.estimated_minutes,
        difficulty=payload.difficulty,
        status=payload.status or "Not Started",
    )
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


@router.get("", response_model=List[TopicResponse])
def list_topics(
    subject_id: Optional[str] = None,
    topic_status: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    query = db.query(Topic)
    if subject_id:
        query = query.filter(Topic.subject_id == subject_id)
    if topic_status:
        query = query.filter(Topic.status == topic_status)
    topics = query.order_by(Topic.created_at.asc()).offset(skip).limit(limit).all()
    return topics


@router.get("/{topic_id}", response_model=TopicResponse)
def get_topic(topic_id: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topic with id '{topic_id}' not found",
        )
    return topic


@router.put("/{topic_id}", response_model=TopicResponse)
def update_topic(topic_id: str, payload: TopicUpdate, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topic with id '{topic_id}' not found",
        )

    if payload.title is not None:
        topic.title = payload.title
    if payload.estimated_minutes is not None:
        topic.estimated_minutes = payload.estimated_minutes
    if payload.difficulty is not None:
        topic.difficulty = payload.difficulty
    if payload.status is not None:
        topic.status = payload.status

    db.commit()
    db.refresh(topic)
    return topic


@router.patch("/{topic_id}/status", response_model=TopicResponse)
def update_topic_status(
    topic_id: str,
    payload: TopicStatusUpdate,
    db: Session = Depends(get_db),
):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topic with id '{topic_id}' not found",
        )

    topic.status = payload.status
    db.commit()
    db.refresh(topic)
    return topic


@router.delete("/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_topic(topic_id: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topic with id '{topic_id}' not found",
        )
    db.delete(topic)
    db.commit()
    return None
