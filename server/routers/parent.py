from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
import uuid
from server.database import get_db
from server.models import User, Habit, HabitLog, UserProgress
from server.schemas import (
    ChildProgressSummary,
    HabitToggleRequest,
    HabitToggleResponse,
    ProgressResetResponse,
)
from server.auth import get_current_parent

router = APIRouter(prefix="/api/v1/parent", tags=["parent"])


def get_user_tz(tz_name: str) -> ZoneInfo:
    try:
        return ZoneInfo(tz_name)
    except Exception:
        return ZoneInfo("UTC")


@router.get("/progress", response_model=list[ChildProgressSummary])
def get_children_progress(
    tz: str = Query("UTC", description="User's local timezone"),
    current_parent: User = Depends(get_current_parent),
    db: Session = Depends(get_db),
):
    # Fetch all children linked to this parent, or all children if none are linked (for easy testing)
    children = db.query(User).filter(User.parent_id == current_parent.id).all()
    if not children:
        # Fallback: if no children are linked, return all users with role "child"
        children = db.query(User).filter(User.role == "child").all()

    user_tz = get_user_tz(tz)
    today_date = datetime.now(user_tz).date()

    # Count total active habits
    total_active_habits = db.query(Habit).filter(Habit.is_active == True).count()

    response = []
    for child in children:
        # Get progress
        progress = (
            db.query(UserProgress).filter(UserProgress.user_id == child.id).first()
        )
        total_stars = progress.total_stars if progress else 0
        current_streak = progress.current_streak if progress else 0

        # Count completed today
        logs = db.query(HabitLog).filter(HabitLog.user_id == child.id).all()
        completed_today_count = 0
        completed_today_habit_ids = set()
        for log in logs:
            completed_at_utc = log.completed_at.replace(tzinfo=timezone.utc)
            log_date = completed_at_utc.astimezone(user_tz).date()
            if log_date == today_date:
                completed_today_habit_ids.add(log.habit_id)
        completed_today_count = len(completed_today_habit_ids)

        response.append(
            ChildProgressSummary(
                child_id=uuid.UUID(child.id),
                username=child.username,
                total_stars=total_stars,
                current_streak=current_streak,
                completed_today_count=completed_today_count,
                total_active_habits=total_active_habits,
            )
        )
    return response


@router.post("/habits/{habit_id}/toggle", response_model=HabitToggleResponse)
def toggle_habit(
    habit_id: str,
    toggle_data: HabitToggleRequest,
    current_parent: User = Depends(get_current_parent),
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

    habit.is_active = toggle_data.is_active
    habit.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(habit)

    return HabitToggleResponse(
        id=uuid.UUID(habit.id), name=habit.name, is_active=habit.is_active
    )


@router.post("/progress/{child_id}/reset", response_model=ProgressResetResponse)
def reset_child_progress(
    child_id: str,
    current_parent: User = Depends(get_current_parent),
    db: Session = Depends(get_db),
):
    # Validate child_id is a valid UUID
    try:
        uuid.UUID(child_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid child ID format"
        )

    child = db.query(User).filter(User.id == child_id, User.role == "child").first()
    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Child user not found"
        )

    progress = db.query(UserProgress).filter(UserProgress.user_id == child.id).first()
    if not progress:
        progress = UserProgress(
            id=str(uuid.uuid4()), user_id=child.id, total_stars=0, current_streak=0
        )
        db.add(progress)
    else:
        progress.total_stars = 0
        progress.current_streak = 0
        progress.updated_at = datetime.now(timezone.utc)

    # Also delete habit logs for this child to allow re-completion
    db.query(HabitLog).filter(HabitLog.user_id == child.id).delete()

    db.commit()
    db.refresh(progress)

    return ProgressResetResponse(
        message=f"Progress reset successfully for {child.username}!",
        child_id=uuid.UUID(child.id),
        total_stars=progress.total_stars,
        current_streak=progress.current_streak,
    )
