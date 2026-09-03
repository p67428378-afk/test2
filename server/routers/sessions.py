"""Session booking, status updates, and photoshoot completion record endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.auth import get_optional_current_user
from server.crud import (
    create_or_update_photoshoot_record,
    create_session,
    get_photoshoot_record_by_session,
    get_session_by_id,
    get_sessions,
    update_session_status,
)
from server.database import get_db
from server.models import User
from server.schemas import (
    PhotoshootRecordCreate,
    PhotoshootRecordOut,
    SessionCreate,
    SessionOut,
    SessionUpdateStatus,
)

router = APIRouter(prefix="/api/v1/sessions", tags=["sessions"])


@router.get("", response_model=List[SessionOut])
def list_sessions(
    status: Optional[str] = Query(None, description="Filter by session status"),
    db: Session = Depends(get_db),
):
    return get_sessions(db, status_filter=status)


@router.get("/{id}", response_model=SessionOut)
def get_session(id: str, db: Session = Depends(get_db)):
    sess = get_session_by_id(db, id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    return sess


@router.post("", response_model=SessionOut, status_code=status.HTTP_201_CREATED)
def book_session(
    session_in: SessionCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    # If user authenticated, use their id; otherwise use default/first customer in DB
    if current_user:
        customer_id = str(current_user.id)
    else:
        cust = db.query(User).filter(User.role == "Customer").first()
        customer_id = str(cust.id) if cust else "default-customer-id"

    created = create_session(db, session_in, customer_id)
    return get_session_by_id(db, str(created.id))


@router.patch("/{id}/status", response_model=SessionOut)
def change_status(
    id: str,
    status_in: SessionUpdateStatus,
    db: Session = Depends(get_db),
):
    updated = update_session_status(db, id, status_in.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Session not found")
    return updated


@router.post("/{id}/photoshoot-record", response_model=PhotoshootRecordOut)
def record_photoshoot(
    id: str,
    record_in: PhotoshootRecordCreate,
    db: Session = Depends(get_db),
):
    return create_or_update_photoshoot_record(db, id, record_in)


@router.get("/{id}/photoshoot-record", response_model=PhotoshootRecordOut)
def get_photoshoot(id: str, db: Session = Depends(get_db)):
    rec = get_photoshoot_record_by_session(db, id)
    if not rec:
        raise HTTPException(status_code=404, detail="Photoshoot record not found")
    return rec
