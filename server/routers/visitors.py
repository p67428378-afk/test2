from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas
from server.auth import get_current_user
from server.services.watchlist_service import screen_national_id

router = APIRouter(prefix="/api/v1/visitors", tags=["Visitors"])


@router.post(
    "/register",
    response_model=schemas.VisitorResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_visitor(visitor_in: schemas.VisitorCreate, db: Session = Depends(get_db)):
    # 1. Check duplicate national_id
    clean_id = visitor_in.national_id.strip()
    existing = (
        db.query(models.Visitor)
        .filter(models.Visitor.national_id.ilike(clean_id))
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Visitor with this National ID is already registered",
        )

    # 2. Automated Watchlist Screening
    is_flagged, _ = screen_national_id(db, clean_id, visitor_in.full_name)

    # 3. Create Visitor Record
    visitor = models.Visitor(
        full_name=visitor_in.full_name.strip(),
        national_id=clean_id,
        email=visitor_in.email.strip().lower(),
        phone=visitor_in.phone,
        address=visitor_in.address,
        photo_id_url=visitor_in.photo_id_url,
        verification_status="PENDING",
        visitor_type=visitor_in.visitor_type.upper()
        if visitor_in.visitor_type
        else "STANDARD",
        is_watchlist_flagged=is_flagged,
    )
    db.add(visitor)
    db.commit()
    db.refresh(visitor)
    return visitor


@router.get("/profile", response_model=schemas.VisitorResponse)
def get_visitor_profile(
    email: Optional[str] = None,
    national_id: Optional[str] = None,
    current_user: Optional[models.User] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(models.Visitor)
    if current_user:
        visitor = query.filter(models.Visitor.email.ilike(current_user.email)).first()
        if visitor:
            return visitor
    if email:
        visitor = query.filter(models.Visitor.email.ilike(email)).first()
        if visitor:
            return visitor
    if national_id:
        visitor = query.filter(
            models.Visitor.national_id.ilike(national_id.strip())
        ).first()
        if visitor:
            return visitor

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Visitor profile not found",
    )


@router.get("", response_model=List[schemas.VisitorResponse])
def list_visitors(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    is_flagged: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Visitor)
    if search:
        query = query.filter(
            (models.Visitor.full_name.ilike(f"%{search}%"))
            | (models.Visitor.national_id.ilike(f"%{search}%"))
            | (models.Visitor.email.ilike(f"%{search}%"))
        )
    if is_flagged is not None:
        query = query.filter(models.Visitor.is_watchlist_flagged == is_flagged)
    return (
        query.order_by(models.Visitor.created_at.desc()).offset(skip).limit(limit).all()
    )


@router.get("/{visitor_id}", response_model=schemas.VisitorResponse)
def get_visitor(visitor_id: str, db: Session = Depends(get_db)):
    visitor = db.query(models.Visitor).filter(models.Visitor.id == visitor_id).first()
    if not visitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Visitor not found"
        )
    return visitor


@router.get("/{visitor_id}/history", response_model=schemas.VisitorHistoryResponse)
def get_visitor_history(visitor_id: str, db: Session = Depends(get_db)):
    visitor = db.query(models.Visitor).filter(models.Visitor.id == visitor_id).first()
    if not visitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Visitor not found"
        )

    appointments = (
        db.query(models.Appointment)
        .filter(models.Appointment.visitor_id == visitor_id)
        .all()
    )
    verifications = (
        db.query(models.Verification)
        .filter(models.Verification.visitor_id == visitor_id)
        .all()
    )

    appt_ids = [a.id for a in appointments]
    entry_exit_logs = []
    if appt_ids:
        entry_exit_logs = (
            db.query(models.EntryExitLog)
            .filter(models.EntryExitLog.appointment_id.in_(appt_ids))
            .all()
        )

    return {
        "visitor": visitor,
        "appointments": appointments,
        "verifications": verifications,
        "entry_exit_logs": entry_exit_logs,
    }
