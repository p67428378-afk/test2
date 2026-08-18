from datetime import timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from server.database import get_db
from server.models import Schedule, Tour, User, Booking
from server.schemas import (
    ScheduleCreate,
    ScheduleUpdate,
    ScheduleResponse,
    TourResponse,
    UserResponse,
)
from server.auth import require_roles

router = APIRouter(prefix="/api/v1/schedules", tags=["Tour Schedules"])


def build_schedule_response(schedule: Schedule, db: Session) -> ScheduleResponse:
    booked = (
        db.query(func.coalesce(func.sum(Booking.ticket_count), 0))
        .filter(Booking.schedule_id == schedule.id, Booking.status == "Confirmed")
        .scalar()
    ) or 0

    remaining = max(0, schedule.max_capacity - booked)

    tour_res = TourResponse.model_validate(schedule.tour) if schedule.tour else None
    guide_res = UserResponse.model_validate(schedule.guide) if schedule.guide else None

    return ScheduleResponse(
        id=schedule.id,
        tour_id=schedule.tour_id,
        guide_id=schedule.guide_id,
        start_time=schedule.start_time,
        max_capacity=schedule.max_capacity,
        booked_tickets=int(booked),
        remaining_capacity=remaining,
        tour=tour_res,
        guide=guide_res,
    )


def validate_guide_overlap(
    guide_id: str,
    tour_id: str,
    start_time,
    db: Session,
    exclude_schedule_id: Optional[str] = None,
):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found",
        )

    new_start = (
        start_time.replace(tzinfo=None)
        if getattr(start_time, "tzinfo", None)
        else start_time
    )
    new_end = new_start + timedelta(minutes=tour.duration_minutes or 60)

    query = db.query(Schedule).filter(Schedule.guide_id == guide_id)
    if exclude_schedule_id:
        query = query.filter(Schedule.id != exclude_schedule_id)

    existing_schedules = query.all()

    for ex_sched in existing_schedules:
        ex_tour = db.query(Tour).filter(Tour.id == ex_sched.tour_id).first()
        ex_duration = ex_tour.duration_minutes if ex_tour else 60
        ex_start = (
            ex_sched.start_time.replace(tzinfo=None)
            if getattr(ex_sched.start_time, "tzinfo", None)
            else ex_sched.start_time
        )
        ex_end = ex_start + timedelta(minutes=ex_duration)

        if max(new_start, ex_start) < min(new_end, ex_end):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Guide is already assigned to an overlapping tour.",
            )


@router.get("", response_model=List[ScheduleResponse])
def list_schedules(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    schedules = (
        db.query(Schedule)
        .options(joinedload(Schedule.tour), joinedload(Schedule.guide))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [build_schedule_response(s, db) for s in schedules]


@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(schedule_id: str, db: Session = Depends(get_db)):
    schedule = (
        db.query(Schedule)
        .options(joinedload(Schedule.tour), joinedload(Schedule.guide))
        .filter(Schedule.id == schedule_id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )
    return build_schedule_response(schedule, db)


@router.post("", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(
    schedule_in: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Administrator")),
):
    tour = db.query(Tour).filter(Tour.id == schedule_in.tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found",
        )

    if schedule_in.guide_id:
        guide = db.query(User).filter(User.id == schedule_in.guide_id).first()
        if not guide:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assigned guide user not found",
            )
        validate_guide_overlap(
            guide_id=schedule_in.guide_id,
            tour_id=schedule_in.tour_id,
            start_time=schedule_in.start_time,
            db=db,
        )

    start_naive = (
        schedule_in.start_time.replace(tzinfo=None)
        if getattr(schedule_in.start_time, "tzinfo", None)
        else schedule_in.start_time
    )

    new_schedule = Schedule(
        tour_id=schedule_in.tour_id,
        guide_id=schedule_in.guide_id,
        start_time=start_naive,
        max_capacity=schedule_in.max_capacity,
    )
    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)
    return build_schedule_response(new_schedule, db)


@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: str,
    schedule_in: ScheduleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Administrator")),
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )

    tour_id = schedule_in.tour_id or schedule.tour_id
    guide_id = (
        schedule_in.guide_id if schedule_in.guide_id is not None else schedule.guide_id
    )
    start_time = schedule_in.start_time or schedule.start_time

    if guide_id:
        guide = db.query(User).filter(User.id == guide_id).first()
        if not guide:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assigned guide user not found",
            )
        validate_guide_overlap(
            guide_id=guide_id,
            tour_id=tour_id,
            start_time=start_time,
            db=db,
            exclude_schedule_id=schedule_id,
        )

    if schedule_in.tour_id is not None:
        schedule.tour_id = schedule_in.tour_id
    if schedule_in.guide_id is not None:
        schedule.guide_id = schedule_in.guide_id
    if schedule_in.start_time is not None:
        schedule.start_time = (
            schedule_in.start_time.replace(tzinfo=None)
            if getattr(schedule_in.start_time, "tzinfo", None)
            else schedule_in.start_time
        )
    if schedule_in.max_capacity is not None:
        schedule.max_capacity = schedule_in.max_capacity

    db.commit()
    db.refresh(schedule)
    return build_schedule_response(schedule, db)


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(
    schedule_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Administrator")),
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found",
        )
    db.delete(schedule)
    db.commit()
    return None
