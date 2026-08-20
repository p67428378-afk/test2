from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo
import uuid
from server.database import get_db
from server.models import User, Habit, HabitLog, UserProgress
from server.schemas import HabitResponse, HabitCompleteResponse
from server.auth import get_current_user

router = APIRouter(prefix="/api/v1/habits", tags=["habits"])


def get_user_tz(tz_name: str) -> ZoneInfo:
    try:
        return ZoneInfo(tz_name)
    except Exception:
        return ZoneInfo("UTC")


@router.get("", response_model=list[HabitResponse])
def get_habits(
    tz: str = Query("UTC", description="User's local timezone"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Only children can view their dashboard habits, or parents can view them too.
    # Let's allow both, but if parent, they might need to specify a child_id.
    # For simplicity, let's assume the current user is the child.
    user_id = current_user.id
    user_tz = get_user_tz(tz)
    today_date = datetime.now(user_tz).date()

    # Fetch all active habits
    habits = db.query(Habit).filter(Habit.is_active == True).all()

    # Fetch all logs for this user
    logs = db.query(HabitLog).filter(HabitLog.user_id == user_id).all()

    # Determine which habits are completed today
    completed_habit_ids = set()
    for log in logs:
        # Convert completed_at to user's timezone
        completed_at_utc = log.completed_at.replace(tzinfo=timezone.utc)
        log_date = completed_at_utc.astimezone(user_tz).date()
        if log_date == today_date:
            completed_habit_ids.add(log.habit_id)

    response = []
    for habit in habits:
        response.append(
            HabitResponse(
                id=uuid.UUID(habit.id),
                name=habit.name,
                description=habit.description,
                icon=habit.icon,
                points=habit.points,
                is_completed_today=habit.id in completed_habit_ids,
            )
        )
    return response


@router.post("/{habit_id}/complete", response_model=HabitCompleteResponse)
def complete_habit(
    habit_id: str,
    tz: str = Query("UTC", description="User's local timezone"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Validate habit_id is a valid UUID
    try:
        uuid.UUID(habit_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid habit ID format"
        )

    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found"
        )

    if not habit.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This habit is currently inactive",
        )

    user_id = current_user.id
    user_tz = get_user_tz(tz)
    today_date = datetime.now(user_tz).date()

    # Check if already completed today
    logs = db.query(HabitLog).filter(HabitLog.user_id == user_id).all()
    completed_today = False
    for log in logs:
        completed_at_utc = log.completed_at.replace(tzinfo=timezone.utc)
        log_date = completed_at_utc.astimezone(user_tz).date()
        if log_date == today_date and log.habit_id == habit_id:
            completed_today = True
            break

    if completed_today:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Habit already completed for today",
        )

    # Record completion
    new_log = HabitLog(
        id=str(uuid.uuid4()),
        user_id=user_id,
        habit_id=habit_id,
        completed_at=datetime.now(timezone.utc),
    )
    db.add(new_log)

    # Update progress
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).first()
    if not progress:
        progress = UserProgress(
            id=str(uuid.uuid4()), user_id=user_id, total_stars=0, current_streak=0
        )
        db.add(progress)

    # Calculate streak
    # Get all unique completion dates for this user (excluding today's new log)
    completion_dates = set()
    for log in logs:
        completed_at_utc = log.completed_at.replace(tzinfo=timezone.utc)
        log_date = completed_at_utc.astimezone(user_tz).date()
        completion_dates.add(log_date)

    yesterday_date = today_date - timedelta(days=1)

    # If they completed at least one habit yesterday
    if yesterday_date in completion_dates:
        # If they haven't completed any habit today yet
        if today_date not in completion_dates:
            progress.current_streak += 1
    else:
        # Yesterday was missed.
        # If they haven't completed any habit today yet, streak resets to 1.
        if today_date not in completion_dates:
            progress.current_streak = 1

    progress.total_stars += habit.points
    progress.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(progress)

    return HabitCompleteResponse(
        message="Habit completed successfully! Great job!",
        points_earned=habit.points,
        new_total_stars=progress.total_stars,
        current_streak=progress.current_streak,
    )
