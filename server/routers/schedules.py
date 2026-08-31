from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from server.database import get_db
from server.models import Attendance, Guide, Schedule, Tour
from server.schemas import (
    AttendanceReportResponse,
    AttendanceResponse,
    ScheduleAssignGuide,
    ScheduleCreate,
    ScheduleResponse,
    ScheduleUpdate,
)

router = APIRouter(prefix="/api/v1/schedules", tags=["Schedules"])


def _build_schedule_response(schedule: Schedule) -> ScheduleResponse:
    booked = sum(
        b.ticket_quantity for b in schedule.bookings if b.booking_status == "Confirmed"
    )
    remaining = max(0, int(schedule.max_capacity) - booked)
    return ScheduleResponse(
        id=str(schedule.id),
        tour_id=str(schedule.tour_id),
        tour_title=str(schedule.tour.title) if schedule.tour else None,
        guide_id=str(schedule.guide_id) if schedule.guide_id else None,
        guide_name=str(schedule.guide.name) if schedule.guide else None,
        start_time=schedule.start_time,
        end_time=schedule.end_time,
        max_capacity=int(schedule.max_capacity),
        status=str(schedule.status),
        booked_tickets=booked,
        booked_count=booked,
        remaining_capacity=remaining,
        available_capacity=remaining,
        created_at=schedule.created_at,
        updated_at=schedule.updated_at,
    )


@router.get("", response_model=List[ScheduleResponse])
def list_schedules(
    tour_id: Optional[str] = None,
    guide_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    available_only: bool = False,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Browse published tour schedules with real-time seat availability filter."""
    query = db.query(Schedule).options(
        joinedload(Schedule.tour),
        joinedload(Schedule.guide),
        joinedload(Schedule.bookings),
    )

    if tour_id:
        query = query.filter(Schedule.tour_id == tour_id)
    if guide_id:
        query = query.filter(Schedule.guide_id == guide_id)
    if status_filter:
        query = query.filter(Schedule.status == status_filter)

    schedules = query.order_by(Schedule.start_time).offset(skip).limit(limit).all()
    results = [_build_schedule_response(s) for s in schedules]

    if available_only:
        results = [
            r for r in results if r.remaining_capacity > 0 and r.status == "Published"
        ]

    return results


@router.post("", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(schedule_in: ScheduleCreate, db: Session = Depends(get_db)):
    """Create and publish a new tour schedule slot with max capacity."""
    if schedule_in.start_time >= schedule_in.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Schedule start_time must be strictly before end_time.",
        )

    tour = db.query(Tour).filter(Tour.id == schedule_in.tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with ID '{schedule_in.tour_id}' not found",
        )

    if schedule_in.guide_id:
        guide = db.query(Guide).filter(Guide.id == schedule_in.guide_id).first()
        if not guide:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Guide with ID '{schedule_in.guide_id}' not found",
            )

        # Conflict check for guide schedule overlap: (start_time < new_end) AND (end_time > new_start)
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

    # Reload with relationships
    schedule = (
        db.query(Schedule)
        .options(
            joinedload(Schedule.tour),
            joinedload(Schedule.guide),
            joinedload(Schedule.bookings),
        )
        .filter(Schedule.id == schedule.id)
        .first()
    )
    return _build_schedule_response(schedule)


@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(schedule_id: str, db: Session = Depends(get_db)):
    """Retrieve schedule details with remaining capacity."""
    schedule = (
        db.query(Schedule)
        .options(
            joinedload(Schedule.tour),
            joinedload(Schedule.guide),
            joinedload(Schedule.bookings),
        )
        .filter(Schedule.id == schedule_id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with ID '{schedule_id}' not found",
        )
    return _build_schedule_response(schedule)


@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: str, schedule_in: ScheduleUpdate, db: Session = Depends(get_db)
):
    """Update schedule details, status, or capacity limit."""
    schedule = (
        db.query(Schedule)
        .options(
            joinedload(Schedule.tour),
            joinedload(Schedule.guide),
            joinedload(Schedule.bookings),
        )
        .filter(Schedule.id == schedule_id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with ID '{schedule_id}' not found",
        )

    new_start = (
        schedule_in.start_time
        if schedule_in.start_time is not None
        else schedule.start_time
    )
    new_end = (
        schedule_in.end_time if schedule_in.end_time is not None else schedule.end_time
    )

    if new_start >= new_end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Schedule start_time must be strictly before end_time.",
        )

    if schedule_in.tour_id is not None and schedule_in.tour_id != schedule.tour_id:
        tour = db.query(Tour).filter(Tour.id == schedule_in.tour_id).first()
        if not tour:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tour with ID '{schedule_in.tour_id}' not found",
            )
        schedule.tour_id = schedule_in.tour_id

    new_guide_id = (
        schedule_in.guide_id if schedule_in.guide_id is not None else schedule.guide_id
    )
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
                Schedule.id != schedule.id,
                Schedule.guide_id == new_guide_id,
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

    if schedule_in.max_capacity is not None:
        booked = sum(
            b.ticket_quantity
            for b in schedule.bookings
            if b.booking_status == "Confirmed"
        )
        if schedule_in.max_capacity < booked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot reduce capacity to {schedule_in.max_capacity} because {booked} tickets are already booked.",
            )
        schedule.max_capacity = schedule_in.max_capacity

    if schedule_in.guide_id is not None:
        schedule.guide_id = schedule_in.guide_id
    if schedule_in.start_time is not None:
        schedule.start_time = schedule_in.start_time
    if schedule_in.end_time is not None:
        schedule.end_time = schedule_in.end_time
    if schedule_in.status is not None:
        schedule.status = schedule_in.status

    db.commit()
    db.refresh(schedule)
    return _build_schedule_response(schedule)


@router.post("/{schedule_id}/assign-guide", response_model=ScheduleResponse)
def assign_guide_to_schedule(
    schedule_id: str, assign_in: ScheduleAssignGuide, db: Session = Depends(get_db)
):
    """Assign a qualified guide to a tour schedule slot with overlap conflict check."""
    schedule = (
        db.query(Schedule)
        .options(
            joinedload(Schedule.tour),
            joinedload(Schedule.guide),
            joinedload(Schedule.bookings),
        )
        .filter(Schedule.id == schedule_id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with ID '{schedule_id}' not found",
        )

    guide = db.query(Guide).filter(Guide.id == assign_in.guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Guide with ID '{assign_in.guide_id}' not found",
        )

    # Check for overlapping schedules
    conflict = (
        db.query(Schedule)
        .filter(
            Schedule.id != schedule.id,
            Schedule.guide_id == assign_in.guide_id,
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

    schedule.guide_id = assign_in.guide_id
    db.commit()
    db.refresh(schedule)

    # Reload relationships
    schedule = (
        db.query(Schedule)
        .options(
            joinedload(Schedule.tour),
            joinedload(Schedule.guide),
            joinedload(Schedule.bookings),
        )
        .filter(Schedule.id == schedule.id)
        .first()
    )
    return _build_schedule_response(schedule)


@router.get("/{schedule_id}/attendance-report", response_model=AttendanceReportResponse)
def get_schedule_attendance_report(schedule_id: str, db: Session = Depends(get_db)):
    """Generate attendance summary report for a completed tour session."""
    schedule = (
        db.query(Schedule)
        .options(
            joinedload(Schedule.tour),
            joinedload(Schedule.bookings),
            joinedload(Schedule.attendance_records).joinedload(Attendance.booking),
        )
        .filter(Schedule.id == schedule_id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with ID '{schedule_id}' not found",
        )

    total_booked = sum(
        b.ticket_quantity for b in schedule.bookings if b.booking_status == "Confirmed"
    )
    total_attended = sum(a.attended_count for a in schedule.attendance_records)

    rate = round((total_attended / total_booked) * 100, 2) if total_booked > 0 else 0.0

    check_in_responses = [
        AttendanceResponse(
            id=str(a.id),
            booking_id=str(a.booking_id),
            schedule_id=str(a.schedule_id),
            visitor_name=str(a.booking.visitor_name) if a.booking else None,
            attended_count=int(a.attended_count),
            check_in_time=a.check_in_time,
            notes=str(a.notes) if a.notes else None,
            created_at=a.created_at,
        )
        for a in schedule.attendance_records
    ]

    return AttendanceReportResponse(
        schedule_id=str(schedule.id),
        tour_title=str(schedule.tour.title) if schedule.tour else "Guided Tour",
        start_time=schedule.start_time,
        end_time=schedule.end_time,
        max_capacity=int(schedule.max_capacity),
        total_booked_tickets=total_booked,
        total_attended_tickets=total_attended,
        attendance_rate_percentage=rate,
        check_ins=check_in_responses,
    )
