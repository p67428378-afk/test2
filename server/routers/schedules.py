from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from server.database import get_db
from server.models import Schedule, Tour, Guide, Booking, Attendance
from server.schemas import (
    ScheduleCreate,
    ScheduleUpdate,
    ScheduleAssignGuide,
    ScheduleResponse,
    ScheduleAttendanceReport,
)

router = APIRouter(prefix="/api/v1/schedules", tags=["Schedules"])


def build_schedule_response(schedule: Schedule, db: Session) -> ScheduleResponse:
    # Calculate booked tickets for confirmed bookings
    booked = (
        db.query(func.coalesce(func.sum(Booking.ticket_quantity), 0))
        .filter(
            Booking.schedule_id == schedule.id,
            Booking.booking_status == "Confirmed",
        )
        .scalar()
    )
    booked_tickets = int(booked or 0)
    remaining = max(0, schedule.max_capacity - booked_tickets)

    tour_title = schedule.tour.title if schedule.tour else None
    guide_name = schedule.guide.name if schedule.guide else None

    return ScheduleResponse(
        id=schedule.id,
        tour_id=schedule.tour_id,
        tour_title=tour_title,
        guide_id=schedule.guide_id,
        guide_name=guide_name,
        start_time=schedule.start_time,
        end_time=schedule.end_time,
        max_capacity=schedule.max_capacity,
        booked_tickets=booked_tickets,
        booked_count=booked_tickets,
        remaining_capacity=remaining,
        status=schedule.status,
        created_at=schedule.created_at,
        updated_at=schedule.updated_at,
    )


def check_guide_overlap(
    guide_id: str,
    start_time: datetime,
    end_time: datetime,
    exclude_schedule_id: Optional[str],
    db: Session,
):
    query = db.query(Schedule).filter(
        Schedule.guide_id == guide_id,
        Schedule.status != "Cancelled",
        Schedule.start_time < end_time,
        Schedule.end_time > start_time,
    )
    if exclude_schedule_id:
        query = query.filter(Schedule.id != exclude_schedule_id)

    conflict = query.first()
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Guide is already assigned to an overlapping tour schedule.",
        )


@router.get("", response_model=List[ScheduleResponse])
@router.get("/", response_model=List[ScheduleResponse], include_in_schema=False)
def list_schedules(
    status_filter: Optional[str] = Query(None, alias="status"),
    tour_id: Optional[str] = None,
    guide_id: Optional[str] = None,
    available_only: bool = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Schedule)
    if status_filter and status_filter != "ALL":
        query = query.filter(Schedule.status == status_filter)
    if tour_id:
        query = query.filter(Schedule.tour_id == tour_id)
    if guide_id:
        query = query.filter(Schedule.guide_id == guide_id)

    query = query.order_by(Schedule.start_time.asc())
    schedules = query.offset(skip).limit(limit).all()

    results = []
    for s in schedules:
        resp = build_schedule_response(s, db)
        if available_only and resp.remaining_capacity <= 0:
            continue
        results.append(resp)
    return results


@router.post("", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
@router.post(
    "/",
    response_model=ScheduleResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_schedule(
    schedule_in: ScheduleCreate,
    db: Session = Depends(get_db),
):
    tour = db.query(Tour).filter(Tour.id == schedule_in.tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with id '{schedule_in.tour_id}' not found.",
        )

    if schedule_in.start_time >= schedule_in.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time.",
        )

    if schedule_in.guide_id:
        guide = db.query(Guide).filter(Guide.id == schedule_in.guide_id).first()
        if not guide:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Guide with id '{schedule_in.guide_id}' not found.",
            )
        check_guide_overlap(
            guide_id=schedule_in.guide_id,
            start_time=schedule_in.start_time,
            end_time=schedule_in.end_time,
            exclude_schedule_id=None,
            db=db,
        )

    schedule = Schedule(
        tour_id=schedule_in.tour_id,
        guide_id=schedule_in.guide_id,
        start_time=schedule_in.start_time,
        end_time=schedule_in.end_time,
        max_capacity=schedule_in.max_capacity,
        status=schedule_in.status,
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    return build_schedule_response(schedule, db)


@router.get("/{id}", response_model=ScheduleResponse)
def get_schedule(
    id: str,
    db: Session = Depends(get_db),
):
    schedule = db.query(Schedule).filter(Schedule.id == id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with id '{id}' not found.",
        )
    return build_schedule_response(schedule, db)


@router.put("/{id}", response_model=ScheduleResponse)
def update_schedule(
    id: str,
    schedule_in: ScheduleUpdate,
    db: Session = Depends(get_db),
):
    schedule = db.query(Schedule).filter(Schedule.id == id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with id '{id}' not found.",
        )

    new_start = schedule_in.start_time or schedule.start_time
    new_end = schedule_in.end_time or schedule.end_time
    new_guide = (
        schedule_in.guide_id if schedule_in.guide_id is not None else schedule.guide_id
    )

    if new_start >= new_end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time.",
        )

    if schedule_in.tour_id is not None:
        tour = db.query(Tour).filter(Tour.id == schedule_in.tour_id).first()
        if not tour:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tour with id '{schedule_in.tour_id}' not found.",
            )
        schedule.tour_id = schedule_in.tour_id

    if new_guide:
        guide = db.query(Guide).filter(Guide.id == new_guide).first()
        if not guide:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Guide with id '{new_guide}' not found.",
            )
        check_guide_overlap(
            guide_id=new_guide,
            start_time=new_start,
            end_time=new_end,
            exclude_schedule_id=schedule.id,
            db=db,
        )
    schedule.guide_id = new_guide

    if schedule_in.start_time is not None:
        schedule.start_time = schedule_in.start_time
    if schedule_in.end_time is not None:
        schedule.end_time = schedule_in.end_time
    if schedule_in.max_capacity is not None:
        schedule.max_capacity = schedule_in.max_capacity
    if schedule_in.status is not None:
        schedule.status = schedule_in.status

    db.commit()
    db.refresh(schedule)
    return build_schedule_response(schedule, db)


@router.post("/{id}/assign-guide", response_model=ScheduleResponse)
def assign_guide_to_schedule(
    id: str,
    payload: ScheduleAssignGuide,
    db: Session = Depends(get_db),
):
    schedule = db.query(Schedule).filter(Schedule.id == id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with id '{id}' not found.",
        )

    guide = db.query(Guide).filter(Guide.id == payload.guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Guide with id '{payload.guide_id}' not found.",
        )

    check_guide_overlap(
        guide_id=payload.guide_id,
        start_time=schedule.start_time,
        end_time=schedule.end_time,
        exclude_schedule_id=schedule.id,
        db=db,
    )

    schedule.guide_id = payload.guide_id
    db.commit()
    db.refresh(schedule)
    return build_schedule_response(schedule, db)


@router.get("/{id}/attendance-report", response_model=ScheduleAttendanceReport)
def get_schedule_attendance_report(
    id: str,
    db: Session = Depends(get_db),
):
    schedule = db.query(Schedule).filter(Schedule.id == id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with id '{id}' not found.",
        )

    # Booked tickets
    booked = (
        db.query(func.coalesce(func.sum(Booking.ticket_quantity), 0))
        .filter(
            Booking.schedule_id == schedule.id,
            Booking.booking_status == "Confirmed",
        )
        .scalar()
    )
    total_booked = int(booked or 0)

    # Attended tickets
    attended = (
        db.query(func.coalesce(func.sum(Attendance.attended_count), 0))
        .filter(Attendance.schedule_id == schedule.id)
        .scalar()
    )
    total_attended = int(attended or 0)
    no_shows = max(0, total_booked - total_attended)

    rate = 0.0
    if total_booked > 0:
        rate = round((total_attended / total_booked) * 100.0, 2)

    bookings_count = (
        db.query(func.count(Booking.id))
        .filter(
            Booking.schedule_id == schedule.id,
            Booking.booking_status == "Confirmed",
        )
        .scalar()
        or 0
    )

    return ScheduleAttendanceReport(
        schedule_id=schedule.id,
        tour_id=schedule.tour_id,
        tour_title=schedule.tour.title if schedule.tour else "Unknown Tour",
        guide_id=schedule.guide_id,
        guide_name=schedule.guide.name if schedule.guide else None,
        start_time=schedule.start_time,
        end_time=schedule.end_time,
        max_capacity=schedule.max_capacity,
        total_booked=total_booked,
        total_attended=total_attended,
        no_shows=no_shows,
        attendance_rate_percentage=rate,
        bookings_count=bookings_count,
    )
