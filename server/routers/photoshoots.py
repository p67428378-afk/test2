from datetime import datetime, timezone
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import PhotoshootRecord, Session as DbSession, User
from server.schemas import PhotoshootRecordCreate, PhotoshootRecordOut
from server.auth import get_current_user, require_role

router = APIRouter(tags=["Photoshoot Records & Completion"])


@router.get("/photoshoots", response_model=List[PhotoshootRecordOut])
def list_photoshoot_records(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    query = db.query(PhotoshootRecord)
    if current_user.role == "customer":
        query = query.join(DbSession).filter(DbSession.customer_id == current_user.id)
    elif current_user.role == "photographer":
        if current_user.photographer_profile:
            query = query.join(DbSession).filter(
                DbSession.photographer_id == current_user.photographer_profile.id
            )
        else:
            return []

    records = query.order_by(PhotoshootRecord.created_at.desc()).all()
    return records


@router.get(
    "/sessions/{session_id}/photoshoot-record", response_model=PhotoshootRecordOut
)
def get_session_photoshoot_record(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sess = db.query(DbSession).filter(DbSession.id == session_id).first()
    if not sess:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Session not found."
        )

    if current_user.role == "customer" and sess.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden."
        )
    if current_user.role == "photographer":
        if (
            not current_user.photographer_profile
            or sess.photographer_id != current_user.photographer_profile.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden."
            )

    record = sess.photoshoot_record
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No photoshoot record found for this session.",
        )

    return record


@router.post(
    "/sessions/{session_id}/photoshoot-record",
    response_model=PhotoshootRecordOut,
    status_code=status.HTTP_200_OK,
)
def create_or_update_photoshoot_record(
    session_id: str,
    record_in: PhotoshootRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["photographer", "admin"])),
):
    # 1. Validate Session
    sess = db.query(DbSession).filter(DbSession.id == session_id).first()
    if not sess:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Session not found."
        )

    if current_user.role == "photographer":
        if (
            not current_user.photographer_profile
            or sess.photographer_id != current_user.photographer_profile.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot record photoshoot for another photographer's session.",
            )

    # 2. Check total payments vs total price
    total_paid = sum(
        p.amount for p in sess.payments if p.payment_status in ["paid", "partial"]
    )
    remaining = max(0.0, sess.total_price - total_paid)

    unpaid_flag = remaining > 0.0
    notice_msg = None
    if unpaid_flag:
        notice_msg = f"Notice: Session has an unpaid remaining balance of ${remaining:.2f}. Completion record stored, but full payment is required for final proofs."

    # 3. Create or update record
    record = sess.photoshoot_record
    if not record:
        record = PhotoshootRecord(
            id=str(uuid.uuid4()),
            session_id=sess.id,
            gallery_url=record_in.gallery_url,
            notes=record_in.notes,
            is_completed=record_in.is_completed,
            unpaid_notice_flag=unpaid_flag,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(record)
    else:
        record.gallery_url = record_in.gallery_url
        record.notes = record_in.notes
        record.is_completed = record_in.is_completed
        record.unpaid_notice_flag = unpaid_flag
        record.updated_at = datetime.now(timezone.utc)

    # 4. Update session status if completed
    if record_in.is_completed:
        sess.status = "completed"
        sess.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(record)

    out = PhotoshootRecordOut(
        id=record.id,
        session_id=record.session_id,
        gallery_url=record.gallery_url,
        notes=record.notes,
        is_completed=record.is_completed,
        unpaid_notice_flag=record.unpaid_notice_flag,
        notice=notice_msg,
        created_at=record.created_at,
        updated_at=record.updated_at,
    )
    return out
