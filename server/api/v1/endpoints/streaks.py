from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server import models, schemas
from server.database import get_db

router = APIRouter()


@router.get("/users/{user_id}/streaks", response_model=schemas.UserStreakDetailResponse)
def get_user_streaks(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    streak = db.query(models.Streak).filter(models.Streak.user_id == user.id).first()
    if not streak:
        streak = models.Streak(
            user_id=user.id,
            current_streak=0,
            longest_streak=0,
            last_logged_date=None,
        )
        db.add(streak)
        db.commit()
        db.refresh(streak)

    # Fetch user badges with details
    user_badges = (
        db.query(models.UserBadge, models.Badge)
        .join(models.Badge, models.UserBadge.badge_id == models.Badge.id)
        .filter(models.UserBadge.user_id == user.id)
        .all()
    )

    badge_list = [
        schemas.UserBadgeResponse(
            badge_id=badge.id,
            name=badge.name,
            description=badge.description,
            icon_key=badge.icon_key,
            awarded_at=ub.awarded_at,
        )
        for ub, badge in user_badges
    ]

    return {
        "user_id": user.id,
        "current_streak": streak.current_streak,
        "longest_streak": streak.longest_streak,
        "last_logged_date": streak.last_logged_date,
        "total_points": user.total_points,
        "is_parent_verified": user.is_parent_verified,
        "badges": badge_list,
    }
