"""
Module: reports router
Purpose: Endpoints for manager dashboard and reports
"""

from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.app.database import get_db
from server.app.models import Task, User
from server.app.schemas import DashboardMetrics, CompletionTrendItem
from server.app.auth import get_current_manager

router = APIRouter()


@router.get("/dashboard", response_model=DashboardMetrics)
def get_dashboard_metrics(
    db: Session = Depends(get_db), current_manager: User = Depends(get_current_manager)
):
    now = datetime.now(timezone.utc)

    # Total tasks
    total_tasks = db.query(Task).count()

    # Completed tasks
    completed_tasks = db.query(Task).filter(Task.status == "Done").count()

    # In progress tasks
    in_progress_tasks = db.query(Task).filter(Task.status == "In Progress").count()

    # Overdue tasks (due date in the past and not Done)
    overdue_tasks = (
        db.query(Task).filter(Task.due_date < now, Task.status != "Done").count()
    )

    # Tasks by priority
    high_count = db.query(Task).filter(Task.priority == "High").count()
    med_count = db.query(Task).filter(Task.priority == "Med").count()
    low_count = db.query(Task).filter(Task.priority == "Low").count()

    tasks_by_priority = {"High": high_count, "Med": med_count, "Low": low_count}

    # Completion trend (last 7 days)
    completion_trend = []
    for i in range(6, -1, -1):
        day_date = now.date() - timedelta(days=i)
        day_str = day_date.strftime("%a")  # e.g., "Mon", "Tue"

        # Count tasks completed on this day
        # We can check updated_at or created_at, let's check updated_at for Done tasks
        start_of_day = datetime.combine(day_date, datetime.min.time()).replace(
            tzinfo=timezone.utc
        )
        end_of_day = datetime.combine(day_date, datetime.max.time()).replace(
            tzinfo=timezone.utc
        )

        completed_on_day = (
            db.query(Task)
            .filter(
                Task.status == "Done",
                Task.updated_at >= start_of_day,
                Task.updated_at <= end_of_day,
            )
            .count()
        )

        completion_trend.append(
            CompletionTrendItem(day=day_str, completed=completed_on_day)
        )

    return DashboardMetrics(
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        in_progress_tasks=in_progress_tasks,
        overdue_tasks=overdue_tasks,
        tasks_by_priority=tasks_by_priority,
        completion_trend=completion_trend,
    )
