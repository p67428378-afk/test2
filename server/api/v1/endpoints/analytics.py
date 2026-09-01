"""Analytics and reporting API endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from server.api.v1.endpoints.auth import get_current_user
from server.crud import (
    get_productivity_analytics,
    get_task_analytics,
)
from server.database import get_db
from server.models import EscalationLog, User
from server.schemas import (
    EscalationLogResponse,
    ProductivityAnalyticsResponse,
    TaskAnalyticsResponse,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get(
    "/tasks",
    response_model=TaskAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get task completion metrics and status distribution",
)
def get_task_metrics(
    project_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Compute task completion metrics, distribution, and completion rates."""
    metrics = get_task_analytics(db, project_id=project_id)
    return metrics


@router.get(
    "/productivity",
    response_model=ProductivityAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get team cycle time and productivity statistics",
)
def get_productivity_metrics(
    project_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Compute average cycle time and individual/team productivity stats."""
    metrics = get_productivity_analytics(db, project_id=project_id)
    return metrics


@router.get(
    "/escalations",
    response_model=List[EscalationLogResponse],
    status_code=status.HTTP_200_OK,
    summary="List escalation logs and alerts",
)
def get_escalations(
    project_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve escalation trigger logs."""
    query = db.query(EscalationLog)
    if project_id:
        query = query.filter(EscalationLog.project_id == project_id)
    return (
        query.order_by(EscalationLog.created_at.desc()).offset(skip).limit(limit).all()
    )
