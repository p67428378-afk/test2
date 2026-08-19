from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.conference import Conference
from server.models.user import User
from server.schemas.conference import ConferenceCreate, ConferenceResponse
from server.dependencies.auth import require_role

router = APIRouter(prefix="/api/v1/conferences", tags=["conferences"])


@router.post("", response_model=ConferenceResponse, status_code=status.HTTP_201_CREATED)
@router.post(
    "/", response_model=ConferenceResponse, status_code=status.HTTP_201_CREATED
)
def create_conference(
    conf_in: ConferenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ORGANIZER", "ADMIN"])),
):
    conf = Conference(
        title=conf_in.title,
        description=conf_in.description,
        location=conf_in.location,
        start_date=conf_in.start_date,
        end_date=conf_in.end_date,
        status=conf_in.status or "DRAFT",
        organizer_id=current_user.id,
    )
    db.add(conf)
    db.commit()
    db.refresh(conf)
    return conf


@router.get("", response_model=List[ConferenceResponse])
@router.get("/", response_model=List[ConferenceResponse])
def list_conferences(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    query = db.query(Conference)
    if status_filter:
        query = query.filter(Conference.status == status_filter)
    conferences = query.offset(skip).limit(limit).all()
    return conferences


@router.get("/{conference_id}", response_model=ConferenceResponse)
def get_conference(conference_id: str, db: Session = Depends(get_db)):
    conf = db.query(Conference).filter(Conference.id == conference_id).first()
    if not conf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found",
        )
    return conf
