from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.schedule import Schedule
from server.models.session import Session as SessionModel
from server.models.conference import Conference
from server.models.user import User
from server.schemas.schedule import ScheduleCreate, ScheduleResponse
from server.dependencies.auth import require_role

router = APIRouter(prefix="/api/v1/schedules", tags=["schedules"])


@router.post(
    "/publish",
    response_model=List[ScheduleResponse],
    status_code=status.HTTP_201_CREATED,
)
def publish_schedule(
    sched_in: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ORGANIZER", "ADMIN"])),
):
    conf = db.query(Conference).filter(Conference.id == sched_in.conference_id).first()
    if not conf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found",
        )

    created_schedules = []
    for slot in sched_in.slots:
        sess = db.query(SessionModel).filter(SessionModel.id == slot.session_id).first()
        if not sess:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Session {slot.session_id} not found",
            )

        # Check if schedule exists for this session
        existing = (
            db.query(Schedule).filter(Schedule.session_id == slot.session_id).first()
        )
        if existing:
            existing.hall_name = slot.hall_name
            existing.start_time = slot.start_time
            existing.end_time = slot.end_time
            db.commit()
            db.refresh(existing)
            created_schedules.append(existing)
        else:
            schedule_obj = Schedule(
                conference_id=sched_in.conference_id,
                session_id=slot.session_id,
                hall_name=slot.hall_name,
                start_time=slot.start_time,
                end_time=slot.end_time,
            )
            # Update session status to SCHEDULED
            sess.status = "SCHEDULED"
            db.add(schedule_obj)
            db.commit()
            db.refresh(schedule_obj)
            created_schedules.append(schedule_obj)

    # Update conference status to PUBLISHED if it was DRAFT
    conf.status = "PUBLISHED"
    db.commit()

    return created_schedules


@router.get("/conference/{conference_id}", response_model=List[ScheduleResponse])
def get_conference_schedule(conference_id: str, db: Session = Depends(get_db)):
    conf = db.query(Conference).filter(Conference.id == conference_id).first()
    if not conf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found",
        )
    schedules = db.query(Schedule).filter(Schedule.conference_id == conference_id).all()
    return schedules
