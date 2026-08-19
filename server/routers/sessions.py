from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.session import Session as SessionModel
from server.models.conference import Conference
from server.models.user import User
from server.schemas.session import SessionCreate, SessionResponse
from server.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/v1/sessions", tags=["sessions"])


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    session_in: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify conference exists
    conf = (
        db.query(Conference).filter(Conference.id == session_in.conference_id).first()
    )
    if not conf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found",
        )

    session_obj = SessionModel(
        conference_id=session_in.conference_id,
        speaker_id=current_user.id,
        title=session_in.title,
        abstract=session_in.abstract,
        track=session_in.track,
        status="SUBMITTED",
    )
    db.add(session_obj)
    db.commit()
    db.refresh(session_obj)
    return session_obj


@router.get("", response_model=List[SessionResponse])
@router.get("/", response_model=List[SessionResponse])
def list_sessions(
    conference_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(SessionModel)
    if conference_id:
        query = query.filter(SessionModel.conference_id == conference_id)
    if status_filter:
        query = query.filter(SessionModel.status == status_filter)

    sessions = query.offset(skip).limit(limit).all()
    return sessions


@router.get("/{session_id}", response_model=SessionResponse)
def get_session(session_id: str, db: Session = Depends(get_db)):
    sess = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not sess:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )
    return sess
