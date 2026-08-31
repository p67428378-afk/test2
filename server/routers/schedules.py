from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from server.database import get_db
from server.models import Schedule, Tour, Guide, Booking, Attendance
from server.schemas import (
    ScheduleCreate,
    ScheduleUpdate,
    ScheduleResponse,
    AssignGuideRequest,
    AttendanceReportResponse,
    AttendanceReportRecord,
)

router = APIRouter(prefix="/api/v1/schedules", tags=["Schedules"])


def enrich_schedule(schedule: Schedule, db: Session) -> ScheduleResponse:
    """Enrich schedule entity with computed fields for response."""
    booked_sum = (
        db.query(func.coalesce(func.sum(Booking.ticket_quantity), 0))
        .filter(
            Booking.schedule_id == schedule.id,
            Booking.booking_status == "Confirmed",
        )
        .scalar()
    )
    booked_tickets = int(booked_sum or 0)
    remaining_capacity = max(0, schedule.max_capacity - booked_tickets)

    tour_title = schedule.tour.title if schedule.tour else None
    guide_name = schedule.guide.name if schedule.guide else None

    return ScheduleResponse(
        id=schedule.id,
        tour_id=schedule.tour_id,
        guide_id=schedule.guide_id,
        start_time=schedule.start_time,
        end_time=schedule.end_time,
        max_capacity=schedule.max_capacity,
        status=schedule.status,
        created_at=schedule.created_at,
        updated_at=schedule.updated_at,
        tour_title=tour_title,
        guide_name=guide_name,
        booked_tickets=booked_tickets,
        remaining_capacity=remaining_capacity,
    )


@router.get("", response_model=List[ScheduleResponse])
def list_schedules(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    tour_id: Optional[str] = None,
    guide_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    available_only: bool = False,
    db: Session = Depends(get_db),
):
    query = db.query(Schedule)
    if tour_id:
        query = query.filter(Schedule.tour_id == tour_id)
    if guide_id:
        query = query.filter(Schedule.guide_id == guide_id)
    if status_filter:
        query = query.filter(Schedule.status == status_filter)

    schedules = (
        query.order_by(Schedule.start_time.asc()).offset(skip).limit(limit).all()
    )

    enriched_list = [enrich_schedule(s, db) for s in schedules]

    if available_only:
        enriched_list = [
            s
            for s in enriched_list
            if s.remaining_capacity > 0 and s.status == "Published"
        ]

    return enriched_list


@router.post("", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(
    schedule_in: ScheduleCreate,
    db: Session = Depends(get_db),
):
    # Validate tour exists
    tour = db.query(Tour).filter(Tour.id == schedule_in.tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with ID '{schedule_in.tour_id}' not found",
        )

    if schedule_in.end_time <= schedule_in.start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Schedule end time must be after start time",
        )

    # Validate guide and check for conflicts if guide_id is supplied
    if schedule_in.guide_id:
        guide = db.query(Guide).filter(Guide.id == schedule_in.guide_id).first()
        if not guide:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Guide with ID '{schedule_in.guide_id}' not found",
            )

        conflict = (
            db.query(Schedule)
            .filter(
                Schedule.guide_id == schedule_in.guide_id,
                Schedule.status != "Cancelled",
                Schedule.start_time < schedule_in.end_time,
                Schedule.end_time > schedule_in.start_time,
            )
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Guide is already assigned to an overlapping tour schedule.",
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
    return enrich_schedule(schedule, db)


@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(
    schedule_id: str,
    db: Session = Depends(get_db),
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with ID '{schedule_id}' not found",
        )
    return enrich_schedule(schedule, db)


@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: str,
    schedule_in: ScheduleUpdate,
    db: Session = Depends(get_db),
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with ID '{schedule_id}' not found",
        )

    update_data = schedule_in.model_dump(exclude_unset=True)

    # Validate tour if updated
    if "tour_id" in update_data and update_data["tour_id"] != schedule.tour_id:
        tour = db.query(Tour).filter(Tour.id == update_data["tour_id"]).first()
        if not tour:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tour with ID '{update_data['tour_id']}' not found",
            )

    new_start = update_data.get("start_time", schedule.start_time)
    new_end = update_data.get("end_time", schedule.end_time)
    if new_end <= new_start:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Schedule end time must be after start time",
        )

    # Validate guide conflict if guide or times updated
    new_guide_id = update_data.get("guide_id", schedule.guide_id)
    if new_guide_id:
        guide = db.query(Guide).filter(Guide.id == new_guide_id).first()
        if not guide:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Guide with ID '{new_guide_id}' not found",
            )

        conflict = (
            db.query(Schedule)
            .filter(
                Schedule.guide_id == new_guide_id,
                Schedule.id != schedule.id,
                Schedule.status != "Cancelled",
                Schedule.start_time < new_end,
                Schedule.end_time > new_start,
            )
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Guide is already assigned to an overlapping tour schedule.",
            )

    for field, value in update_data.items():
        setattr(schedule, field, value)

    db.commit()
    db.refresh(schedule)
    return enrich_schedule(schedule, db)


@router.post("/{schedule_id}/assign-guide", response_model=ScheduleResponse)
def assign_guide_to_schedule(
    schedule_id: str,
    payload: AssignGuideRequest,
    db: Session = Depends(get_db),
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with ID '{schedule_id}' not found",
        )

    guide = db.query(Guide).filter(Guide.id == payload.guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Guide with ID '{payload.guide_id}' not found",
        )

    # Check for overlapping schedule for this guide
    conflict = (
        db.query(Schedule)
        .filter(
            Schedule.guide_id == payload.guide_id,
            Schedule.id != schedule.id,
            Schedule.status != "Cancelled",
            Schedule.start_time < schedule.end_time,
            Schedule.end_time > schedule.start_time,
        )
        .first()
    )

    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Guide is already assigned to an overlapping tour schedule.",
        )

    schedule.guide_id = payload.guide_id
    db.commit()
    db.refresh(schedule)
    return enrich_schedule(schedule, db)


@router.get("/{schedule_id}/attendance-report", response_model=AttendanceReportResponse)
def get_attendance_report(
    schedule_id: str,
    db: Session = Depends(get_db),
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with ID '{schedule_id}' not found",
        )

    # Booked tickets count
    booked_sum = (
        db.query(func.coalesce(func.sum(Booking.ticket_quantity), 0))
        .filter(
            Booking.schedule_id == schedule.id,
            Booking.booking_status == "Confirmed",
        )
        .scalar()
    )
    total_booked = int(booked_sum or 0)

    # Attended count
    attended_sum = (
        db.query(func.coalesce(func.sum(Attendance.attended_count), 0))
        .filter(Attendance.schedule_id == schedule.id)
        .scalar()
    )
    total_attended = int(attended_sum or 0)

    no_shows = max(0, total_booked - total_attended)
    rate = (
        round((total_attended / total_booked * 100.0), 2) if total_booked > 0 else 0.0
    )

    # Get detailed attendance records
    attendance_records = (
        db.query(Attendance)
        .filter(Attendance.schedule_id == schedule.id)
        .order_by(Attendance.check_in_time.desc())
        .all()
    )

    report_records = []
    for att in attendance_records:
        booking = att.booking
        report_records.append(
            AttendanceReportRecord(
                id=att.id,
                booking_id=att.booking_id,
                visitor_name=booking.visitor_name if booking else "Unknown",
                visitor_email=booking.visitor_email
                if booking
                else "unknown@example.com",
                booked_quantity=booking.ticket_quantity
                if booking
                else att.attended_count,
                attended_count=att.attended_count,
                check_in_time=att.check_in_time,
                notes=att.notes,
            )
        )

    tour_title = schedule.tour.title if schedule.tour else "Museum Tour"

    return AttendanceReportResponse(
        schedule_id=schedule.id,
        tour_title=tour_title,
        start_time=schedule.start_time,
        end_time=schedule.end_time,
        max_capacity=schedule.max_capacity,
        total_booked=total_booked,
        total_attended=total_attended,
        no_shows=no_shows,
        attendance_rate_percentage=rate,
        records=report_records,
    )
