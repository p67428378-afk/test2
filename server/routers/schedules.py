"""Tour Schedule management and guide assignment endpoints."""

from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Schedule, Tour, Guide, Booking, Attendance
from server.schemas import (
    ScheduleCreate,
    ScheduleResponse,
    ScheduleUpdate,
    GuideAssignRequest,
    AttendanceReportResponse,
    AttendanceResponse,
)

router = APIRouter(prefix="/api/v1/schedules", tags=["Schedules"])


def build_schedule_response(schedule: Schedule) -> ScheduleResponse:
    """Helper to construct ScheduleResponse with computed capacity metrics."""
    booked_tickets = sum(
        b.ticket_quantity for b in schedule.bookings if b.booking_status == "Confirmed"
    )
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
        tour_title=tour_title,
        guide_name=guide_name,
        booked_tickets=booked_tickets,
        remaining_capacity=remaining_capacity,
        created_at=schedule.created_at,
        updated_at=schedule.updated_at,
    )


@router.get("", response_model=List[ScheduleResponse])
def list_schedules(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (Draft, Published, Cancelled)"),
    tour_id: Optional[str] = Query(None, description="Filter by tour ID"),
    guide_id: Optional[str] = Query(None, description="Filter by guide ID"),
    available_only: bool = Query(False, description="Filter only slots with remaining seats"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List tour schedule slots with real-time seat availability."""
    query = db.query(Schedule)
    if status_filter:
        query = query.filter(Schedule.status == status_filter)
    if tour_id:
        query = query.filter(Schedule.tour_id == tour_id)
    if guide_id:
        query = query.filter(Schedule.guide_id == guide_id)

    schedules = query.order_by(Schedule.start_time.asc()).offset(skip).limit(limit).all()
    results = [build_schedule_response(s) for s in schedules]

    if available_only:
        results = [r for r in results if r.remaining_capacity > 0 and r.status == "Published"]

    return results


@router.post("", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(
    schedule_in: ScheduleCreate,
    db: Session = Depends(get_db),
):
    """Create and publish a new tour schedule slot."""
    if schedule_in.end_time <= schedule_in.start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Schedule end_time must be after start_time."
        )

    tour = db.query(Tour).filter(Tour.id == schedule_in.tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Referenced tour not found."
        )

    if schedule_in.guide_id:
        guide = db.query(Guide).filter(Guide.id == schedule_in.guide_id).first()
        if not guide:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Referenced guide not found."
            )
        # Check overlap
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
                detail="Guide is already assigned to an overlapping tour schedule."
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
    return build_schedule_response(schedule)


@router.get("/{id}", response_model=ScheduleResponse)
def get_schedule(
    id: str,
    db: Session = Depends(get_db),
):
    """Get schedule slot by ID."""
    schedule = db.query(Schedule).filter(Schedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found")
    return build_schedule_response(schedule)


@router.put("/{id}", response_model=ScheduleResponse)
def update_schedule(
    id: str,
    schedule_in: ScheduleUpdate,
    db: Session = Depends(get_db),
):
    """Update schedule details or capacity limit."""
    schedule = db.query(Schedule).filter(Schedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found")

    new_start = schedule_in.start_time if schedule_in.start_time is not None else schedule.start_time
    new_end = schedule_in.end_time if schedule_in.end_time is not None else schedule.end_time

    if new_end <= new_start:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Schedule end_time must be after start_time."
        )

    target_guide_id = schedule_in.guide_id if schedule_in.guide_id is not None else schedule.guide_id
    target_status = schedule_in.status if schedule_in.status is not None else schedule.status

    if target_guide_id and target_status != "Cancelled":
        conflict = (
            db.query(Schedule)
            .filter(
                Schedule.id != schedule.id,
                Schedule.guide_id == target_guide_id,
                Schedule.status != "Cancelled",
                Schedule.start_time < new_end,
                Schedule.end_time > new_start,
            )
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Guide is already assigned to an overlapping tour schedule."
            )

    if schedule_in.tour_id is not None:
        tour = db.query(Tour).filter(Tour.id == schedule_in.tour_id).first()
        if not tour:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour not found")
        schedule.tour_id = schedule_in.tour_id

    if schedule_in.guide_id is not None:
        schedule.guide_id = schedule_in.guide_id
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
    return build_schedule_response(schedule)


@router.post("/{id}/assign-guide", response_model=ScheduleResponse)
def assign_guide_to_schedule(
    id: str,
    payload: Optional[GuideAssignRequest] = None,
    guide_id: Optional[str] = Query(None, description="Guide ID query param fallback"),
    db: Session = Depends(get_db),
):
    """Assign a qualified guide to a tour schedule slot with overlap conflict check."""
    target_guide_id = payload.guide_id if payload else guide_id
    if not target_guide_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Guide ID must be provided."
        )

    schedule = db.query(Schedule).filter(Schedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found")

    guide = db.query(Guide).filter(Guide.id == target_guide_id).first()
    if not guide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Guide not found")

    # Overlap detection query:
    # Schedule S conflicts if: S.guide_id == guide.id AND S.id != schedule.id AND S.status != 'Cancelled'
    # AND S.start_time < schedule.end_time AND S.end_time > schedule.start_time
    conflict = (
        db.query(Schedule)
        .filter(
            Schedule.id != schedule.id,
            Schedule.guide_id == guide.id,
            Schedule.status != "Cancelled",
            Schedule.start_time < schedule.end_time,
            Schedule.end_time > schedule.start_time,
        )
        .first()
    )

    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Guide is already assigned to an overlapping tour schedule."
        )

    schedule.guide_id = guide.id
    db.commit()
    db.refresh(schedule)
    return build_schedule_response(schedule)


@router.get("/{id}/attendance-report", response_model=AttendanceReportResponse)
def get_attendance_report(
    id: str,
    db: Session = Depends(get_db),
):
    """Generate attendance summary report for a tour session."""
    schedule = db.query(Schedule).filter(Schedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found")

    total_booked = sum(
        b.ticket_quantity for b in schedule.bookings if b.booking_status == "Confirmed"
    )
    attendances = db.query(Attendance).filter(Attendance.schedule_id == id).all()
    total_attended = sum(a.attended_count for a in attendances)
    no_shows = max(0, total_booked - total_attended)

    rate = (total_attended / total_booked * 100.0) if total_booked > 0 else 0.0

    return AttendanceReportResponse(
        schedule_id=schedule.id,
        tour_title=schedule.tour.title if schedule.tour else "Unknown Tour",
        start_time=schedule.start_time,
        end_time=schedule.end_time,
        max_capacity=schedule.max_capacity,
        total_booked=total_booked,
        total_attended=total_attended,
        no_shows=no_shows,
        attendance_rate_percentage=round(rate, 2),
        records=[AttendanceResponse.model_validate(a) for a in attendances],
    )
