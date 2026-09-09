from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session, joinedload
from server.database import get_db
from server.models import User, UserPlant
from server.schemas import (
    DashboardScheduleResponse,
    DashboardScheduleStats,
    PlantNotificationItem,
    NotificationSummaryResponse,
)
from server.middleware.auth import get_current_user

router = APIRouter()


@router.get("/dashboard", response_model=DashboardScheduleResponse)
def get_dashboard_schedules(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plants = (
        db.query(UserPlant)
        .options(joinedload(UserPlant.species))
        .filter(UserPlant.user_id == current_user.id)
        .order_by(UserPlant.next_due_date.asc())
        .all()
    )

    now = datetime.now(timezone.utc)
    today = now.date()

    due_today = []
    overdue = []
    upcoming = []

    for plant in plants:
        if not plant.next_due_date:
            upcoming.append(plant)
            continue

        plant_due_date = plant.next_due_date.date()
        if plant_due_date < today:
            overdue.append(plant)
        elif plant_due_date == today:
            due_today.append(plant)
        else:
            upcoming.append(plant)

    total_plants = len(plants)
    overdue_count = len(overdue)
    due_today_count = len(due_today)
    healthy_count = max(0, total_plants - overdue_count)

    if total_plants > 0:
        care_score = max(0, int(100 - (overdue_count / total_plants * 50)))
    else:
        care_score = 100

    stats = DashboardScheduleStats(
        total_plants=total_plants,
        overdue_count=overdue_count,
        due_today_count=due_today_count,
        healthy_count=healthy_count,
        care_score=care_score,
    )

    return DashboardScheduleResponse(
        due_today=due_today,
        overdue=overdue,
        upcoming=upcoming,
        summary_stats=stats,
    )


@router.get("/notifications", response_model=NotificationSummaryResponse)
def get_watering_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fetch active watering reminders and alerts for plants that have notifications_enabled=True.
    """
    plants = (
        db.query(UserPlant)
        .filter(
            UserPlant.user_id == current_user.id,
            UserPlant.notifications_enabled.is_(True),
        )
        .all()
    )

    now = datetime.now(timezone.utc)
    today = now.date()
    alerts = []

    for plant in plants:
        if not plant.next_due_date:
            continue

        plant_due_date = plant.next_due_date.date()
        if plant_due_date < today:
            days_overdue = (today - plant_due_date).days
            alerts.append(
                PlantNotificationItem(
                    plant_id=plant.id,
                    nickname=plant.nickname,
                    location=plant.location,
                    status="overdue",
                    next_due_date=plant.next_due_date,
                    message=f"'{plant.nickname}' is overdue for watering by {days_overdue} day(s)!",
                )
            )
        elif plant_due_date == today:
            alerts.append(
                PlantNotificationItem(
                    plant_id=plant.id,
                    nickname=plant.nickname,
                    location=plant.location,
                    status="due_today",
                    next_due_date=plant.next_due_date,
                    message=f"'{plant.nickname}' is scheduled for watering today.",
                )
            )

    return NotificationSummaryResponse(
        notifications=alerts,
        total_alerts=len(alerts),
        sent_to_email=current_user.email,
        timestamp=now,
    )


@router.post(
    "/notifications/send",
    response_model=NotificationSummaryResponse,
    status_code=status.HTTP_200_OK,
)
def trigger_daily_reminder_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Simulate sending daily summary reminder notifications (push/email) for plants due or overdue.
    """
    return get_watering_notifications(current_user=current_user, db=db)
