from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Volunteer, Shift, User
from server.schemas import (
    VolunteerCreate,
    VolunteerResponse,
    ShiftCreate,
    ShiftResponse,
    ShiftCheckInRequest,
)
from server.auth import require_role

router = APIRouter(
    prefix="/api/v1/volunteers", tags=["Volunteer Roster & Shift Coordination"]
)


@router.get("/shifts", response_model=List[ShiftResponse])
def get_shifts(
    volunteer_id: Optional[str] = None,
    zone: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Shift)
    if volunteer_id:
        query = query.filter(Shift.volunteer_id == volunteer_id)
    if zone:
        query = query.filter(Shift.zone == zone)
    shifts = query.all()

    return [
        ShiftResponse(
            id=str(s.id),
            volunteer_id=str(s.volunteer_id),
            zone=s.zone,
            start_time=s.start_time,
            end_time=s.end_time,
            status=s.status,
            check_in_time=s.updated_at if s.status == "ACTIVE" else None,
        )
        for s in shifts
    ]


@router.post("/check-in", response_model=ShiftResponse)
def check_in_volunteer(payload: ShiftCheckInRequest, db: Session = Depends(get_db)):
    shift = (
        db.query(Shift)
        .filter(
            Shift.id == payload.shift_id, Shift.volunteer_id == payload.volunteer_id
        )
        .first()
    )
    if not shift:
        raise HTTPException(
            status_code=404,
            detail="Shift or Volunteer assignment not found",
        )

    if shift.status == "COMPLETED":
        raise HTTPException(
            status_code=400,
            detail="Shift is already completed",
        )

    shift.status = "ACTIVE"
    shift.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(shift)

    return ShiftResponse(
        id=str(shift.id),
        volunteer_id=str(shift.volunteer_id),
        zone=shift.zone,
        start_time=shift.start_time,
        end_time=shift.end_time,
        status=shift.status,
        check_in_time=shift.updated_at,
    )


@router.post(
    "",
    response_model=VolunteerResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role(["ADMIN", "VOLUNTEER_COORDINATOR"]))],
)
def create_volunteer(payload: VolunteerCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    volunteer = Volunteer(
        user_id=payload.user_id,
        phone=payload.phone,
        assigned_zone=payload.assigned_zone,
    )
    db.add(volunteer)
    db.commit()
    db.refresh(volunteer)

    return VolunteerResponse(
        id=str(volunteer.id),
        user_id=str(volunteer.user_id),
        phone=volunteer.phone,
        assigned_zone=volunteer.assigned_zone,
        created_at=volunteer.created_at,
    )


@router.post(
    "/shifts",
    response_model=ShiftResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role(["ADMIN", "VOLUNTEER_COORDINATOR"]))],
)
def create_shift(payload: ShiftCreate, db: Session = Depends(get_db)):
    volunteer = db.query(Volunteer).filter(Volunteer.id == payload.volunteer_id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    if payload.end_time <= payload.start_time:
        raise HTTPException(status_code=400, detail="end_time must be after start_time")

    # Prevent double booking volunteers across overlapping shifts
    overlap = (
        db.query(Shift)
        .filter(
            Shift.volunteer_id == payload.volunteer_id,
            Shift.status != "CANCELLED",
            Shift.start_time < payload.end_time,
            Shift.end_time > payload.start_time,
        )
        .first()
    )
    if overlap:
        raise HTTPException(
            status_code=409,
            detail="Volunteer already has an assigned shift overlapping this time window",
        )

    shift = Shift(
        volunteer_id=payload.volunteer_id,
        zone=payload.zone,
        start_time=payload.start_time,
        end_time=payload.end_time,
        status="PENDING",
    )
    db.add(shift)
    db.commit()
    db.refresh(shift)

    return ShiftResponse(
        id=str(shift.id),
        volunteer_id=str(shift.volunteer_id),
        zone=shift.zone,
        start_time=shift.start_time,
        end_time=shift.end_time,
        status=shift.status,
        check_in_time=None,
    )


@router.get("", response_model=List[VolunteerResponse])
def list_volunteers(db: Session = Depends(get_db)):
    volunteers = db.query(Volunteer).all()
    return [
        VolunteerResponse(
            id=str(v.id),
            user_id=str(v.user_id),
            phone=v.phone,
            assigned_zone=v.assigned_zone,
            created_at=v.created_at,
        )
        for v in volunteers
    ]
