from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from server.database import get_db
from server.models import StudySchedule, Topic, DailyStudyGoal, StudyLog
from server.schemas import (
    StudyScheduleCreate,
    StudyScheduleUpdate,
    StudyScheduleResponse,
    DailyGoalCreate,
    DailyGoalResponse,
)

router = APIRouter(prefix="/schedules", tags=["Schedules"])


def compute_daily_goal_stats(goal: DailyStudyGoal, db: Session) -> DailyGoalResponse:
    # Compute scheduled minutes and completed minutes for the target date
    # Format target_date: YYYY-MM-DD
    target_str = goal.target_date
    all_schedules = db.query(StudySchedule).all()
    scheduled_mins = sum(
        s.duration_minutes
        for s in all_schedules
        if s.scheduled_date.strftime("%Y-%m-%d") == target_str
    )
    all_logs = db.query(StudyLog).all()
    completed_mins = sum(
        log.session_minutes
        for log in all_logs
        if log.logged_at.strftime("%Y-%m-%d") == target_str
    )

    return DailyGoalResponse(
        id=goal.id,
        target_date=goal.target_date,
        target_minutes=goal.target_minutes,
        scheduled_minutes=scheduled_mins,
        completed_minutes=completed_mins,
        goal_met=(completed_mins >= goal.target_minutes),
        created_at=goal.created_at,
        updated_at=goal.updated_at,
    )


@router.post(
    "/daily-goal", response_model=DailyGoalResponse, status_code=status.HTTP_201_CREATED
)
def set_daily_study_goal(payload: DailyGoalCreate, db: Session = Depends(get_db)):
    """Set or update daily study time goal."""
    goal = (
        db.query(DailyStudyGoal)
        .filter(DailyStudyGoal.target_date == payload.target_date)
        .first()
    )
    if goal:
        goal.target_minutes = payload.target_minutes
        goal.updated_at = datetime.now(timezone.utc)
    else:
        goal = DailyStudyGoal(
            target_date=payload.target_date,
            target_minutes=payload.target_minutes,
        )
        db.add(goal)
    db.commit()
    db.refresh(goal)
    return compute_daily_goal_stats(goal, db)


@router.get("/daily-goal/{target_date}", response_model=DailyGoalResponse)
def get_daily_study_goal(target_date: str, db: Session = Depends(get_db)):
    """Fetch daily study time goal and progress for a specific date (YYYY-MM-DD)."""
    goal = (
        db.query(DailyStudyGoal)
        .filter(DailyStudyGoal.target_date == target_date)
        .first()
    )
    if not goal:
        # Default goal of 120 minutes if not set
        goal = DailyStudyGoal(target_date=target_date, target_minutes=120)
        db.add(goal)
        db.commit()
        db.refresh(goal)
    return compute_daily_goal_stats(goal, db)


@router.post(
    "", response_model=StudyScheduleResponse, status_code=status.HTTP_201_CREATED
)
def create_schedule(payload: StudyScheduleCreate, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == payload.topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topic with id '{payload.topic_id}' not found",
        )

    schedule = StudySchedule(
        topic_id=payload.topic_id,
        scheduled_date=payload.scheduled_date,
        duration_minutes=payload.duration_minutes,
        is_completed=payload.is_completed or False,
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule


@router.get("", response_model=List[StudyScheduleResponse])
def list_schedules(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    topic_id: Optional[str] = None,
    is_completed: Optional[bool] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    query = db.query(StudySchedule).options(joinedload(StudySchedule.topic))

    if topic_id:
        query = query.filter(StudySchedule.topic_id == topic_id)
    if is_completed is not None:
        query = query.filter(StudySchedule.is_completed == is_completed)
    if start_date:
        query = query.filter(StudySchedule.scheduled_date >= start_date)
    if end_date:
        query = query.filter(StudySchedule.scheduled_date <= end_date)

    schedules = (
        query.order_by(StudySchedule.scheduled_date.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return schedules


@router.get("/{schedule_id}", response_model=StudyScheduleResponse)
def get_schedule(schedule_id: str, db: Session = Depends(get_db)):
    schedule = (
        db.query(StudySchedule)
        .options(joinedload(StudySchedule.topic))
        .filter(StudySchedule.id == schedule_id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with id '{schedule_id}' not found",
        )
    return schedule


@router.patch("/{schedule_id}", response_model=StudyScheduleResponse)
@router.put("/{schedule_id}", response_model=StudyScheduleResponse)
def update_schedule(
    schedule_id: str,
    payload: StudyScheduleUpdate,
    db: Session = Depends(get_db),
):
    schedule = (
        db.query(StudySchedule)
        .options(joinedload(StudySchedule.topic))
        .filter(StudySchedule.id == schedule_id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with id '{schedule_id}' not found",
        )

    if payload.scheduled_date is not None:
        schedule.scheduled_date = payload.scheduled_date
    if payload.duration_minutes is not None:
        schedule.duration_minutes = payload.duration_minutes
    if payload.is_completed is not None:
        schedule.is_completed = payload.is_completed

    db.commit()
    db.refresh(schedule)
    return schedule


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(schedule_id: str, db: Session = Depends(get_db)):
    schedule = db.query(StudySchedule).filter(StudySchedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule with id '{schedule_id}' not found",
        )
    db.delete(schedule)
    db.commit()
    return None
