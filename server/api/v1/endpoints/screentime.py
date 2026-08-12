from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta, time
import uuid

from server import schemas, crud, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user

router = APIRouter()


def _process_async_export(user_id: str, task_id: str):
    # Simulated background task for exports exceeding 10,000 log entries
    print(f"Completed background export task {task_id} for user {user_id}")


@router.post(
    "/screentime/sessions",
    response_model=schemas.SessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def log_screentime_session(
    session_data: schemas.SessionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if session_data.end_time < session_data.start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="end_time must be greater than or equal to start_time",
        )

    duration_seconds = int(
        (session_data.end_time - session_data.start_time).total_seconds()
    )

    db_session = crud.create_screentime_session(
        db=db,
        user_id=current_user.id,
        session_data=session_data,
        duration_seconds=duration_seconds,
    )

    # Check for limit threshold notifications
    limits = crud.get_usage_limits(db, current_user.id)
    alerts: List[schemas.AlertNotification] = []

    for limit in limits:
        target = limit.category_or_app.strip().lower()
        if target in (
            session_data.app_name.strip().lower(),
            session_data.category.strip().lower(),
        ):
            usage_sec = crud.get_todays_usage_for_target(
                db, current_user.id, limit.category_or_app
            )
            if limit.daily_limit_seconds > 0:
                pct = (usage_sec / limit.daily_limit_seconds) * 100
                limit_mins = limit.daily_limit_seconds // 60
                if pct >= 100:
                    alerts.append(
                        schemas.AlertNotification(
                            category_or_app=limit.category_or_app,
                            threshold="100%",
                            message=f"Daily limit of {limit_mins} minutes reached for {limit.category_or_app}",
                        )
                    )
                elif pct >= 80:
                    alerts.append(
                        schemas.AlertNotification(
                            category_or_app=limit.category_or_app,
                            threshold="80%",
                            message=f"Warning: 80% of daily limit ({limit_mins} minutes) reached for {limit.category_or_app}",
                        )
                    )

    response = schemas.SessionResponse.from_orm(db_session)
    response.alerts_triggered = alerts
    return response


@router.get("/screentime/sessions", response_model=List[schemas.SessionResponse])
def list_screentime_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    app_name: Optional[str] = None,
    category: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sessions = crud.get_screentime_sessions(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        app_name=app_name,
        category=category,
        start_date=start_date,
        end_date=end_date,
    )
    return [schemas.SessionResponse.from_orm(s) for s in sessions]


@router.delete(
    "/screentime/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_screentime_session(
    session_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = crud.delete_screentime_session(db, session_id, current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Screen time session not found",
        )
    return None


@router.delete("/screentime/clear", status_code=status.HTTP_200_OK)
def clear_screentime_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    crud.clear_user_screentime_sessions(db, current_user.id)
    return {"message": "All screen time session history cleared successfully"}


@router.get("/screentime/analytics", response_model=schemas.AnalyticsResponse)
def get_screentime_analytics(
    period: str = Query("daily", regex="^(hourly|daily|weekly)$"),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now = datetime.utcnow()

    # Parse or set range
    dt_end = now
    if end_date:
        try:
            dt_end = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
        except ValueError:
            dt_end = now

    if start_date:
        try:
            dt_start = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        except ValueError:
            dt_start = now - timedelta(days=7)
    else:
        if period == "hourly":
            dt_start = datetime.combine(now.date(), time.min)
        elif period == "weekly":
            dt_start = now - timedelta(days=30)
        else:  # daily
            dt_start = now - timedelta(days=7)

    sessions = crud.get_screentime_sessions(
        db=db,
        user_id=current_user.id,
        skip=0,
        limit=10000,
        start_date=dt_start,
        end_date=dt_end,
    )

    total_seconds = sum(s.duration_seconds for s in sessions)

    if total_seconds == 0 or not sessions:
        return schemas.AnalyticsResponse(
            period=period,
            start_date=dt_start.isoformat(),
            end_date=dt_end.isoformat(),
            total_screen_time_seconds=0,
            top_applications=[],
            category_breakdown=[],
        )

    # Aggregate by app
    app_totals = {}
    for s in sessions:
        key = (s.app_name, s.category)
        app_totals[key] = app_totals.get(key, 0) + s.duration_seconds

    top_apps = [
        schemas.AnalyticsTopApp(
            app_name=app_name,
            category=cat,
            duration_seconds=dur,
            percentage=round((dur / total_seconds) * 100, 2),
        )
        for (app_name, cat), dur in sorted(
            app_totals.items(), key=lambda x: x[1], reverse=True
        )
    ]

    # Aggregate by category
    cat_totals = {}
    for s in sessions:
        cat_totals[s.category] = cat_totals.get(s.category, 0) + s.duration_seconds

    cat_breakdown = [
        schemas.AnalyticsCategoryBreakdown(
            category=cat,
            duration_seconds=dur,
            percentage=round((dur / total_seconds) * 100, 2),
        )
        for cat, dur in sorted(cat_totals.items(), key=lambda x: x[1], reverse=True)
    ]

    return schemas.AnalyticsResponse(
        period=period,
        start_date=dt_start.isoformat(),
        end_date=dt_end.isoformat(),
        total_screen_time_seconds=total_seconds,
        top_applications=top_apps,
        category_breakdown=cat_breakdown,
    )


@router.get("/screentime/limits", response_model=List[schemas.LimitResponse])
def list_usage_limits(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    limits = crud.get_usage_limits(db, current_user.id)
    results = []
    for lim in limits:
        usage = crud.get_todays_usage_for_target(
            db, current_user.id, lim.category_or_app
        )
        pct = (
            round((usage / lim.daily_limit_seconds) * 100, 2)
            if lim.daily_limit_seconds > 0
            else 0.0
        )
        resp = schemas.LimitResponse.from_orm(lim)
        resp.current_usage_seconds = usage
        resp.percentage_used = pct
        results.append(resp)
    return results


@router.post(
    "/screentime/limits",
    response_model=schemas.LimitResponse,
    status_code=status.HTTP_200_OK,
)
def create_or_update_limit(
    limit_data: schemas.LimitCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_limit = crud.create_or_update_usage_limit(
        db=db, user_id=current_user.id, limit_data=limit_data
    )
    usage = crud.get_todays_usage_for_target(
        db, current_user.id, db_limit.category_or_app
    )
    pct = (
        round((usage / db_limit.daily_limit_seconds) * 100, 2)
        if db_limit.daily_limit_seconds > 0
        else 0.0
    )

    resp = schemas.LimitResponse.from_orm(db_limit)
    resp.current_usage_seconds = usage
    resp.percentage_used = pct
    return resp


@router.delete("/screentime/limits/{limit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_usage_limit(
    limit_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = crud.delete_usage_limit(db, limit_id, current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usage limit rule not found",
        )
    return None


@router.get("/screentime/export", response_model=schemas.ExportResponse)
def export_usage_data(
    background_tasks: BackgroundTasks,
    export_type: str = "json",
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    count = crud.count_screentime_sessions(db, current_user.id)
    now_iso = datetime.utcnow().isoformat()

    if count > 10000:
        task_id = str(uuid.uuid4())
        background_tasks.add_task(_process_async_export, str(current_user.id), task_id)
        return schemas.ExportResponse(
            export_type=export_type,
            total_records=count,
            user_id=str(current_user.id),
            generated_at=now_iso,
            status="processing",
            message="Export dataset exceeds 10,000 records; compilation started in background.",
            task_id=task_id,
            sessions=None,
            limits=None,
        )

    sessions = crud.get_screentime_sessions(db, current_user.id, skip=0, limit=10000)
    limits = crud.get_usage_limits(db, current_user.id)

    serialized_sessions = [
        {
            "id": str(s.id),
            "app_name": s.app_name,
            "category": s.category,
            "start_time": s.start_time.isoformat() if s.start_time else None,
            "end_time": s.end_time.isoformat() if s.end_time else None,
            "duration_seconds": s.duration_seconds,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in sessions
    ]

    serialized_limits = [
        {
            "id": str(lim.id),
            "category_or_app": lim.category_or_app,
            "daily_limit_seconds": lim.daily_limit_seconds,
            "created_at": lim.created_at.isoformat() if lim.created_at else None,
            "updated_at": lim.updated_at.isoformat() if lim.updated_at else None,
        }
        for lim in limits
    ]

    return schemas.ExportResponse(
        export_type=export_type,
        total_records=count,
        user_id=str(current_user.id),
        generated_at=now_iso,
        status="completed",
        message="Data export completed successfully.",
        task_id=None,
        sessions=serialized_sessions,
        limits=serialized_limits,
    )
