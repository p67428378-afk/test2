from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
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
)

router = APIRouter(prefix="/api/v1/schedules", tags=["Schedules"])


def _build_schedule_response(schedule: Schedule, db: Session) -> ScheduleResponse:
    # Calculate booked tickets for active bookings
    booked_count = (
        db.query(func.coalesce(func.sum(Booking.ticket_quantity), 0))
        .filter(
            Booking.schedule_id == schedule.id,
            Booking.booking_status != "Cancelled",
        )
        .scalar()
        or 0
    )

    remaining = max(0, schedule.max_capacity - booked_count)
    tour_title = schedule.tour.title if schedule.tour else "Museum Tour"
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
        booked_tickets=booked_count,
        remaining_capacity=remaining,
        created_at=schedule.created_at,
        updated_at=schedule.updated_at,
    )


@router.get("", response_model=List[ScheduleResponse])
def get_schedules(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(Schedule)
    if status:
        query = query.filter(Schedule.status == status)
    schedules = (
        query.order_by(Schedule.start_time.asc()).offset(skip).limit(limit).all()
    )
    return [_build_schedule_response(s, db) for s in schedules]


@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(schedule_id: str, db: Session = Depends(get_db)):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )
    return _build_schedule_response(schedule, db)


@router.post("", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(sched_in: ScheduleCreate, db: Session = Depends(get_db)):
    # Verify tour exists
    tour = db.query(Tour).filter(Tour.id == sched_in.tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Tour not found"
        )

    # If guide_id provided, verify guide exists and check for overlap
    if sched_in.guide_id:
        guide = db.query(Guide).filter(Guide.id == sched_in.guide_id).first()
        if not guide:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Guide not found"
            )

        conflict = (
            db.query(Schedule)
            .filter(
                Schedule.guide_id == sched_in.guide_id,
                Schedule.status != "Cancelled",
                Schedule.start_time < sched_in.end_time,
                Schedule.end_time > sched_in.start_time,
            )
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Schedule conflict: Guide is already assigned to an overlapping tour slot.",
            )

    schedule = Schedule(
        tour_id=sched_in.tour_id,
        guide_id=sched_in.guide_id,
        start_time=sched_in.start_time,
        end_time=sched_in.end_time,
        max_capacity=sched_in.max_capacity,
        status=sched_in.status,
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return _build_schedule_response(schedule, db)


@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: str, sched_in: ScheduleUpdate, db: Session = Depends(get_db)
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )

    start_t = sched_in.start_time or schedule.start_time
    end_t = sched_in.end_time or schedule.end_time
    guide_id = sched_in.guide_id if sched_in.guide_id is not None else schedule.guide_id

    if guide_id:
        guide = db.query(Guide).filter(Guide.id == guide_id).first()
        if not guide:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Guide not found"
            )

        conflict = (
            db.query(Schedule)
            .filter(
                Schedule.guide_id == guide_id,
                Schedule.id != schedule.id,
                Schedule.status != "Cancelled",
                Schedule.start_time < end_t,
                Schedule.end_time > start_t,
            )
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Schedule conflict: Guide is already assigned to an overlapping tour slot.",
            )

    if sched_in.tour_id is not None:
        tour = db.query(Tour).filter(Tour.id == sched_in.tour_id).first()
        if not tour:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Tour not found"
            )
        schedule.tour_id = sched_in.tour_id
    if sched_in.guide_id is not None:
        schedule.guide_id = sched_in.guide_id
    if sched_in.start_time is not None:
        schedule.start_time = sched_in.start_time
    if sched_in.end_time is not None:
        schedule.end_time = sched_in.end_time
    if sched_in.max_capacity is not None:
        schedule.max_capacity = sched_in.max_capacity
    if sched_in.status is not None:
        schedule.status = sched_in.status

    db.commit()
    db.refresh(schedule)
    return _build_schedule_response(schedule, db)


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(schedule_id: str, db: Session = Depends(get_db)):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )
    db.delete(schedule)
    db.commit()
    return None


@router.post("/{schedule_id}/assign-guide", response_model=ScheduleResponse)
def assign_guide_to_schedule(
    schedule_id: str, assign_in: AssignGuideRequest, db: Session = Depends(get_db)
):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )

    guide = db.query(Guide).filter(Guide.id == assign_in.guide_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Guide not found"
        )

    # Check for overlapping schedules for this guide
    conflict = (
        db.query(Schedule)
        .filter(
            Schedule.guide_id == assign_in.guide_id,
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
            detail="Schedule conflict: Guide is already assigned to an overlapping tour slot.",
        )

    schedule.guide_id = assign_in.guide_id
    db.commit()
    db.refresh(schedule)
    return _build_schedule_response(schedule, db)


@router.get("/{schedule_id}/attendance-report", response_model=AttendanceReportResponse)
def get_schedule_attendance_report(schedule_id: str, db: Session = Depends(get_db)):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )

    total_booked = (
        db.query(func.coalesce(func.sum(Booking.ticket_quantity), 0))
        .filter(
            Booking.schedule_id == schedule.id,
            Booking.booking_status != "Cancelled",
        )
        .scalar()
        or 0
    )

    total_attended = (
        db.query(func.coalesce(func.sum(Attendance.attended_count), 0))
        .filter(Attendance.schedule_id == schedule.id)
        .scalar()
        or 0
    )

    no_shows = max(0, total_booked - total_attended)
    rate = (
        round((total_attended / total_booked) * 100.0, 2) if total_booked > 0 else 0.0
    )
    tour_title = schedule.tour.title if schedule.tour else "Museum Tour"

    return AttendanceReportResponse(
        schedule_id=schedule.id,
        tour_title=tour_title,
        start_time=schedule.start_time,
        end_time=schedule.end_time,
        max_capacity=schedule.max_capacity,
        total_booked_tickets=total_booked,
        total_attended_tickets=total_attended,
        no_shows=no_shows,
        attendance_rate_percentage=rate,
    )
