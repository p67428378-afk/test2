from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import UserPlant, User
from server.schemas import (
    DashboardSchedulesOut,
    SummaryStats,
    NotificationSummaryOut,
    NotificationItem,
    SendNotificationResponse,
)
from server.routers.plants import _to_plant_out
from server.middleware.auth import get_current_user

router = APIRouter(prefix="/api/v1/schedules", tags=["Care Schedules & Notifications"])


def ensure_utc(dt: Optional[datetime]) -> Optional[datetime]:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


@router.get("", response_model=DashboardSchedulesOut)
@router.get("/dashboard", response_model=DashboardSchedulesOut)
def get_dashboard_schedules(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plants = (
        db.query(UserPlant)
        .filter(UserPlant.user_id == current_user.id)
        .order_by(UserPlant.next_water_due.asc().nullslast())
        .all()
    )

    now = datetime.now(timezone.utc)
    today_end = now + timedelta(hours=24)

    overdue_plants = []
    due_today_plants = []
    upcoming_plants = []

    for p in plants:
        p_out = _to_plant_out(p)
        p_next_due = ensure_utc(p.next_water_due)

        if not p_next_due:
            upcoming_plants.append(p_out)
        elif p_next_due < now or str(p.status) == "overdue":
            overdue_plants.append(p_out)
        elif p_next_due <= today_end:
            due_today_plants.append(p_out)
        else:
            upcoming_plants.append(p_out)

    total_plants = len(plants)
    overdue_count = len(overdue_plants)
    due_today_count = len(due_today_plants)
    healthy_count = sum(
        1 for p in plants if str(p.status) in ["Active", "Good", "Repotted"]
    )

    if total_plants > 0:
        care_score = max(0, min(100, 100 - (overdue_count * 15)))
    else:
        care_score = 100

    summary_stats = SummaryStats(
        overdue_count=overdue_count,
        due_today_count=due_today_count,
        total_plants=total_plants,
        healthy_count=healthy_count,
        care_score=care_score,
    )

    return DashboardSchedulesOut(
        overdue=overdue_plants,
        due_today=due_today_plants,
        upcoming=upcoming_plants,
        summary_stats=summary_stats,
    )


@router.get("/notifications", response_model=NotificationSummaryOut)
def get_watering_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    today_end = now + timedelta(hours=24)

    plants = (
        db.query(UserPlant)
        .filter(
            UserPlant.user_id == current_user.id,
            UserPlant.notifications_enabled.is_(True),
        )
        .all()
    )

    alerts: List[NotificationItem] = []
    overdue_count = 0
    due_today_count = 0

    for p in plants:
        p_snoozed = ensure_utc(p.snoozed_until)
        # Check snooze
        if p_snoozed and p_snoozed > now:
            continue

        p_next_due = ensure_utc(p.next_water_due)
        if p_next_due and p_next_due < now:
            overdue_count += 1
            alerts.append(
                NotificationItem(
                    plant_id=str(p.id),
                    nickname=str(p.nickname),
                    care_type="WATERING",
                    due_date=p.next_water_due,
                    is_overdue=True,
                    location=str(p.location) if p.location else "Indoor",
                )
            )
        elif p_next_due and p_next_due <= today_end:
            due_today_count += 1
            alerts.append(
                NotificationItem(
                    plant_id=str(p.id),
                    nickname=str(p.nickname),
                    care_type="WATERING",
                    due_date=p.next_water_due,
                    is_overdue=False,
                    location=str(p.location) if p.location else "Indoor",
                )
            )

    return NotificationSummaryOut(
        total_alerts=len(alerts),
        overdue_count=overdue_count,
        due_today_count=due_today_count,
        alerts=alerts,
    )


@router.post("/notifications/send", response_model=SendNotificationResponse)
def trigger_reminder_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notif_data = get_watering_notifications(current_user=current_user, db=db)
    return SendNotificationResponse(
        status="sent",
        message=f"Dispatched daily care summary to {current_user.email}",
        total_alerts=notif_data.total_alerts,
        recipients=[str(current_user.email)],
    )
