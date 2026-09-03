from datetime import datetime, date, time, timezone
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Photographer, Availability, Session as DbSession, User
from server.schemas import (
    PhotographerCreate,
    PhotographerOut,
    AvailabilityCreate,
    AvailabilityOut,
    AvailabilitySetResponse,
    ConflictingSessionSummary,
    SlotOut,
)
from server.auth import require_role

router = APIRouter(prefix="/photographers", tags=["Photographers & Availability"])


@router.get("", response_model=List[PhotographerOut])
def list_photographers(db: Session = Depends(get_db)):
    photographers = db.query(Photographer).all()
    results = []
    for p in photographers:
        out = PhotographerOut(
            id=p.id,
            user_id=p.user_id,
            bio=p.bio,
            specialties=p.specialties,
            full_name=p.user.full_name if p.user else None,
            email=p.user.email if p.user else None,
            created_at=p.created_at,
            updated_at=p.updated_at,
        )
        results.append(out)
    return results


@router.get("/{photographer_id}", response_model=PhotographerOut)
def get_photographer(photographer_id: str, db: Session = Depends(get_db)):
    p = db.query(Photographer).filter(Photographer.id == photographer_id).first()
    if not p:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Photographer not found."
        )
    return PhotographerOut(
        id=p.id,
        user_id=p.user_id,
        bio=p.bio,
        specialties=p.specialties,
        full_name=p.user.full_name if p.user else None,
        email=p.user.email if p.user else None,
        created_at=p.created_at,
        updated_at=p.updated_at,
    )


@router.post("", response_model=PhotographerOut, status_code=status.HTTP_201_CREATED)
def create_photographer(
    p_in: PhotographerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "photographer"])),
):
    target_user_id = (
        p_in.user_id
        if (current_user.role == "admin" and p_in.user_id)
        else current_user.id
    )

    existing = (
        db.query(Photographer).filter(Photographer.user_id == target_user_id).first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Photographer profile already exists for this user.",
        )

    photographer = Photographer(
        id=str(uuid.uuid4()),
        user_id=target_user_id,
        bio=p_in.bio,
        specialties=p_in.specialties,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(photographer)
    db.commit()
    db.refresh(photographer)

    return PhotographerOut(
        id=photographer.id,
        user_id=photographer.user_id,
        bio=photographer.bio,
        specialties=photographer.specialties,
        full_name=photographer.user.full_name if photographer.user else None,
        email=photographer.user.email if photographer.user else None,
        created_at=photographer.created_at,
        updated_at=photographer.updated_at,
    )


@router.get("/{photographer_id}/availability", response_model=List[AvailabilityOut])
def get_photographer_availability(photographer_id: str, db: Session = Depends(get_db)):
    p = db.query(Photographer).filter(Photographer.id == photographer_id).first()
    if not p:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Photographer not found."
        )
    return p.availabilities


@router.post("/{photographer_id}/availability", response_model=AvailabilitySetResponse)
def set_photographer_availability(
    photographer_id: str,
    avail_in: AvailabilityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["photographer", "admin"])),
):
    p = db.query(Photographer).filter(Photographer.id == photographer_id).first()
    if not p:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Photographer not found."
        )

    # If photographer role, ensure they are managing their own availability
    if current_user.role == "photographer" and p.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot edit availability for another photographer.",
        )

    warning_msg = None
    conflicting_list = []

    # Check for conflicts if blocking a specific date or time range
    if avail_in.is_blocked and avail_in.date:
        start_of_day = datetime.combine(avail_in.date, time.min)
        end_of_day = datetime.combine(avail_in.date, time.max)

        conflicting_sessions = (
            db.query(DbSession)
            .filter(
                DbSession.photographer_id == photographer_id,
                DbSession.start_time >= start_of_day,
                DbSession.start_time <= end_of_day,
                DbSession.status.in_(["confirmed", "pending_payment", "in_progress"]),
            )
            .all()
        )

        if conflicting_sessions:
            warning_msg = f"Conflict Alert: {avail_in.date} has {len(conflicting_sessions)} confirmed/active booking session(s). Blocking this date requires rescheduling or admin override."
            for s in conflicting_sessions:
                conflicting_list.append(
                    ConflictingSessionSummary(
                        session_id=s.id,
                        start_time=s.start_time.isoformat(),
                        end_time=s.end_time.isoformat(),
                        customer_name=s.customer.full_name if s.customer else None,
                        status=s.status,
                    )
                )

    # Save the availability record
    avail = Availability(
        id=str(uuid.uuid4()),
        photographer_id=photographer_id,
        date=avail_in.date,
        day_of_week=avail_in.day_of_week,
        start_time=avail_in.start_time,
        end_time=avail_in.end_time,
        is_blocked=avail_in.is_blocked,
        reason=avail_in.reason,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(avail)
    db.commit()
    db.refresh(avail)

    avail_out = AvailabilityOut(
        id=avail.id,
        photographer_id=avail.photographer_id,
        date=avail.date,
        day_of_week=avail.day_of_week,
        start_time=avail.start_time,
        end_time=avail.end_time,
        is_blocked=avail.is_blocked,
        reason=avail.reason,
        created_at=avail.created_at,
        updated_at=avail.updated_at,
    )

    return AvailabilitySetResponse(
        availability=avail_out,
        warning=warning_msg,
        conflicting_sessions=conflicting_list,
    )


@router.get("/{photographer_id}/slots", response_model=List[SlotOut])
def get_photographer_slots(
    photographer_id: str,
    target_date: date = Query(..., alias="date"),
    db: Session = Depends(get_db),
):
    p = db.query(Photographer).filter(Photographer.id == photographer_id).first()
    if not p:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Photographer not found."
        )

    # 1. Check if the specific date is completely blocked
    date_blocked = (
        db.query(Availability)
        .filter(
            Availability.photographer_id == photographer_id,
            Availability.date == target_date,
            Availability.is_blocked == True,
        )
        .first()
    )

    if date_blocked:
        return []

    # 2. Determine working hours for target_date
    day_of_week = target_date.weekday()  # 0=Monday, 6=Sunday
    avail_rule = (
        db.query(Availability)
        .filter(
            Availability.photographer_id == photographer_id,
            Availability.date == target_date,
            Availability.is_blocked == False,
        )
        .first()
    )

    if not avail_rule:
        avail_rule = (
            db.query(Availability)
            .filter(
                Availability.photographer_id == photographer_id,
                Availability.day_of_week == day_of_week,
                Availability.is_blocked == False,
            )
            .first()
        )

    # Fallback to default working hours (09:00 to 17:00) if no rule exists
    start_hour = 9
    end_hour = 17
    if avail_rule:
        try:
            start_hour = int(avail_rule.start_time.split(":")[0])
            end_hour = int(avail_rule.end_time.split(":")[0])
        except Exception:
            start_hour, end_hour = 9, 17

    # 3. Retrieve all existing sessions for this photographer on target_date
    start_of_day = datetime.combine(target_date, time.min)
    end_of_day = datetime.combine(target_date, time.max)
    now_utc = datetime.now(timezone.utc)

    existing_sessions = (
        db.query(DbSession)
        .filter(
            DbSession.photographer_id == photographer_id,
            DbSession.start_time >= start_of_day,
            DbSession.start_time <= end_of_day,
            DbSession.status != "cancelled",
        )
        .all()
    )

    # Filter out expired holds
    active_sessions = []
    for s in existing_sessions:
        if s.status == "pending_payment" and s.hold_expires_at:
            # Check if hold expired
            hold_exp = (
                s.hold_expires_at.replace(tzinfo=timezone.utc)
                if s.hold_expires_at.tzinfo is None
                else s.hold_expires_at
            )
            if hold_exp < now_utc:
                continue
        active_sessions.append(s)

    # 4. Generate 1-hour slots
    slots: List[SlotOut] = []
    for h in range(start_hour, end_hour):
        slot_start_dt = datetime.combine(target_date, time(hour=h, minute=0))
        slot_end_dt = datetime.combine(target_date, time(hour=h + 1, minute=0))

        # Check collision with active sessions
        is_occupied = False
        for s in active_sessions:
            s_start = (
                s.start_time.replace(tzinfo=None)
                if s.start_time.tzinfo
                else s.start_time
            )
            s_end = s.end_time.replace(tzinfo=None) if s.end_time.tzinfo else s.end_time
            # Overlap check
            if not (slot_end_dt <= s_start or slot_start_dt >= s_end):
                is_occupied = True
                break

        slots.append(
            SlotOut(
                start_time=f"{h:02d}:00",
                end_time=f"{h + 1:02d}:00",
                is_available=not is_occupied,
                date=target_date.isoformat(),
            )
        )

    return slots
