from datetime import datetime, timedelta, timezone
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Session as DbSession, Package, Photographer, User
from server.schemas import (
    SessionCreate,
    SessionOut,
    SessionDetailOut,
    SessionStatusUpdate,
    PhotoshootRecordOut,
)
from server.routers.packages import STUDIO_ADDONS
from server.auth import get_current_user

router = APIRouter(prefix="/sessions", tags=["Session Booking & Management"])


ADDON_PRICE_MAP = {addon.id: addon.price for addon in STUDIO_ADDONS}
ADDON_NAME_MAP = {addon.id: addon.name for addon in STUDIO_ADDONS}


def build_session_detail(s: DbSession) -> SessionDetailOut:
    total_paid = sum(
        p.amount for p in s.payments if p.payment_status in ["paid", "partial"]
    )
    remaining = max(0.0, s.total_price - total_paid)

    photo_rec = None
    if s.photoshoot_record:
        photo_rec = PhotoshootRecordOut(
            id=s.photoshoot_record.id,
            session_id=s.photoshoot_record.session_id,
            gallery_url=s.photoshoot_record.gallery_url,
            notes=s.photoshoot_record.notes,
            is_completed=s.photoshoot_record.is_completed,
            unpaid_notice_flag=s.photoshoot_record.unpaid_notice_flag,
            created_at=s.photoshoot_record.created_at,
            updated_at=s.photoshoot_record.updated_at,
        )

    return SessionDetailOut(
        id=s.id,
        customer_id=s.customer_id,
        photographer_id=s.photographer_id,
        package_id=s.package_id,
        start_time=s.start_time,
        end_time=s.end_time,
        status=s.status,
        total_price=s.total_price,
        deposit_amount=s.deposit_amount,
        hold_expires_at=s.hold_expires_at,
        event_notes=s.event_notes,
        add_ons=s.add_ons,
        created_at=s.created_at,
        updated_at=s.updated_at,
        customer_name=s.customer.full_name if s.customer else None,
        customer_email=s.customer.email if s.customer else None,
        photographer_name=s.photographer.user.full_name
        if (s.photographer and s.photographer.user)
        else None,
        package_name=s.package.name if s.package else None,
        paid_amount=round(total_paid, 2),
        remaining_balance=round(remaining, 2),
        photoshoot_record=photo_rec,
    )


@router.get("", response_model=List[SessionDetailOut])
def list_sessions(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(DbSession)

    if current_user.role == "customer":
        query = query.filter(DbSession.customer_id == current_user.id)
    elif current_user.role == "photographer":
        if current_user.photographer_profile:
            query = query.filter(
                DbSession.photographer_id == current_user.photographer_profile.id
            )
        else:
            return []
    # Admin sees all

    if status_filter:
        query = query.filter(DbSession.status == status_filter)

    sessions = query.order_by(DbSession.start_time.desc()).all()
    results = []

    now_utc = datetime.now(timezone.utc)
    for s in sessions:
        # Check if pending payment expired
        if s.status == "pending_payment" and s.hold_expires_at:
            exp = (
                s.hold_expires_at.replace(tzinfo=timezone.utc)
                if s.hold_expires_at.tzinfo is None
                else s.hold_expires_at
            )
            if exp < now_utc:
                s.status = "cancelled"
                db.commit()

        results.append(build_session_detail(s))

    return results


@router.get("/{session_id}", response_model=SessionDetailOut)
def get_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    s = db.query(DbSession).filter(DbSession.id == session_id).first()
    if not s:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Session not found."
        )

    if current_user.role == "customer" and s.customer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden."
        )
    if current_user.role == "photographer":
        if (
            not current_user.photographer_profile
            or s.photographer_id != current_user.photographer_profile.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden."
            )

    now_utc = datetime.now(timezone.utc)
    if s.status == "pending_payment" and s.hold_expires_at:
        exp = (
            s.hold_expires_at.replace(tzinfo=timezone.utc)
            if s.hold_expires_at.tzinfo is None
            else s.hold_expires_at
        )
        if exp < now_utc:
            s.status = "cancelled"
            db.commit()

    return build_session_detail(s)


@router.post("", response_model=SessionOut, status_code=status.HTTP_201_CREATED)
def book_session(
    sess_in: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Validate package
    package = (
        db.query(Package)
        .filter(Package.id == sess_in.package_id, Package.is_active == True)
        .first()
    )
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Selected package not found."
        )

    # 2. Validate photographer
    photographer = (
        db.query(Photographer)
        .filter(Photographer.id == sess_in.photographer_id)
        .first()
    )
    if not photographer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Selected photographer not found.",
        )

    # 3. Calculate start_time and end_time
    start_dt = (
        sess_in.start_time.replace(tzinfo=None)
        if sess_in.start_time.tzinfo
        else sess_in.start_time
    )
    end_dt = start_dt + timedelta(minutes=package.duration_minutes)

    # 4. Double-Booking Prevention: Check conflicting sessions
    now_naive = datetime.now(timezone.utc).replace(tzinfo=None)
    existing_conflicts = (
        db.query(DbSession)
        .filter(
            DbSession.photographer_id == sess_in.photographer_id,
            DbSession.status != "cancelled",
        )
        .all()
    )

    for s in existing_conflicts:
        s_start = (
            s.start_time.replace(tzinfo=None) if s.start_time.tzinfo else s.start_time
        )
        s_end = s.end_time.replace(tzinfo=None) if s.end_time.tzinfo else s.end_time

        # If it's pending_payment, check if hold expired
        if s.status == "pending_payment" and s.hold_expires_at:
            exp_naive = (
                s.hold_expires_at.replace(tzinfo=None)
                if s.hold_expires_at.tzinfo
                else s.hold_expires_at
            )
            if exp_naive < now_naive:
                s.status = "cancelled"
                db.commit()
                continue

        # Check collision overlap
        if not (end_dt <= s_start or start_dt >= s_end):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Selected photographer time slot is no longer available.",
            )

    # 5. Dynamic price calculation (Package base price + add-ons)
    total_price = float(package.price)
    selected_addons_summary = []
    if sess_in.add_on_ids:
        for addon_id in sess_in.add_on_ids:
            if addon_id in ADDON_PRICE_MAP:
                total_price += ADDON_PRICE_MAP[addon_id]
                selected_addons_summary.append(ADDON_NAME_MAP.get(addon_id, addon_id))

    deposit_amount = round(total_price * 0.5, 2)
    hold_expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    addons_text = (
        ", ".join(selected_addons_summary) if selected_addons_summary else None
    )

    # 6. Create session
    new_session = DbSession(
        id=str(uuid.uuid4()),
        customer_id=current_user.id,
        photographer_id=sess_in.photographer_id,
        package_id=sess_in.package_id,
        start_time=start_dt,
        end_time=end_dt,
        status="pending_payment",
        total_price=round(total_price, 2),
        deposit_amount=deposit_amount,
        hold_expires_at=hold_expires_at,
        event_notes=sess_in.event_notes,
        add_ons=addons_text,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session


@router.patch("/{session_id}/status", response_model=SessionOut)
def update_session_status(
    session_id: str,
    status_in: SessionStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    s = db.query(DbSession).filter(DbSession.id == session_id).first()
    if not s:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Session not found."
        )

    valid_statuses = [
        "pending_payment",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
    ]
    if status_in.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of {valid_statuses}",
        )

    s.status = status_in.status
    s.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(s)
    return s
