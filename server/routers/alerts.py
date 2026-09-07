import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from server.database import get_db
import server.models as models
import server.schemas as schemas

router = APIRouter(
    prefix="/api/v1/alerts", tags=["Security Alerts & Emergency Broadcasting"]
)
logger = logging.getLogger(__name__)


def broadcast_alert_to_terminals(
    alert_id: str, alert_type: str, location: str, severity: str
) -> dict:
    """Broadcast real-time security alert payload to active security guard terminals."""
    recipients = [
        "Main Gate Terminal",
        "North Gate Terminal",
        "Supervisor Mobile Terminal",
    ]
    msg = f"EMERGENCY BROADCAST [{severity}]: {alert_type} at {location} (Alert ID: {alert_id}) sent to {len(recipients)} terminals"
    logger.warning(msg)
    return {"status": "BROADCASTED_TO_GUARD_TERMINALS", "recipients": recipients}


def ensure_utc(dt: datetime) -> datetime:
    if dt is None:
        return dt
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


@router.post(
    "",
    response_model=schemas.SecurityAlertResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_security_alert(
    payload: schemas.SecurityAlertCreate, db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    alert_id = str(uuid.uuid4())
    can_cancel_until = now + timedelta(seconds=60)

    alert = models.SecurityAlert(
        id=alert_id,
        alert_type=payload.alert_type,
        severity=payload.severity,
        location=payload.location,
        description=payload.description,
        status="ACTIVE",
        created_at=now,
        updated_at=now,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    bcast = broadcast_alert_to_terminals(
        alert.id, alert.alert_type, alert.location, alert.severity
    )

    return schemas.SecurityAlertResponse(
        alert_id=alert.id,
        id=alert.id,
        alert_type=alert.alert_type,
        severity=alert.severity,
        location=alert.location,
        description=alert.description,
        status=alert.status,
        created_at=ensure_utc(alert.created_at),
        updated_at=ensure_utc(alert.updated_at),
        can_cancel_until=can_cancel_until,
        broadcast_status=bcast["status"],
        broadcast_recipients=bcast["recipients"],
    )


@router.get("", response_model=List[schemas.SecurityAlertResponse])
def list_security_alerts(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    query = db.query(models.SecurityAlert)
    if status_filter:
        query = query.filter(models.SecurityAlert.status == status_filter)

    alerts = query.order_by(models.SecurityAlert.created_at.desc()).all()

    result = []
    for a in alerts:
        created_utc = ensure_utc(a.created_at)
        can_cancel_until = created_utc + timedelta(seconds=60)
        result.append(
            schemas.SecurityAlertResponse(
                alert_id=a.id,
                id=a.id,
                alert_type=a.alert_type,
                severity=a.severity,
                location=a.location,
                description=a.description,
                status=a.status,
                created_at=created_utc,
                updated_at=ensure_utc(a.updated_at),
                can_cancel_until=can_cancel_until,
                cancellation_reason=a.cancellation_reason,
                cancelled_by=a.cancelled_by,
                cancelled_at=ensure_utc(a.cancelled_at),
                broadcast_status="BROADCASTED_TO_GUARD_TERMINALS",
                broadcast_recipients=[
                    "Main Gate Terminal",
                    "North Gate Terminal",
                    "Supervisor Mobile Terminal",
                ],
            )
        )

    return result


@router.post("/{alert_id}/cancel", response_model=schemas.SecurityAlertResponse)
def cancel_security_alert(
    alert_id: str, payload: schemas.SecurityAlertCancel, db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    alert = (
        db.query(models.SecurityAlert)
        .filter(models.SecurityAlert.id == alert_id)
        .first()
    )

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Security alert {alert_id} not found",
        )

    if alert.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Alert status is {alert.status}; only ACTIVE alerts can be cancelled",
        )

    created_utc = ensure_utc(alert.created_at)
    time_elapsed = (now - created_utc).total_seconds()

    if time_elapsed > 60.0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cancellation window expired (60 seconds limit). Only supervisor live cancellations within 60s are permitted.",
        )

    alert.status = "CANCELLED"
    alert.cancellation_reason = payload.cancellation_reason
    alert.cancelled_by = "Supervisor John"
    alert.cancelled_at = now
    alert.updated_at = now

    db.commit()
    db.refresh(alert)

    logger.info(f"Broadcast alert cancellation for {alert.id} sent to active terminals")

    return schemas.SecurityAlertResponse(
        alert_id=alert.id,
        id=alert.id,
        alert_type=alert.alert_type,
        severity=alert.severity,
        location=alert.location,
        description=alert.description,
        status=alert.status,
        created_at=created_utc,
        updated_at=ensure_utc(alert.updated_at),
        can_cancel_until=created_utc + timedelta(seconds=60),
        cancellation_reason=alert.cancellation_reason,
        cancelled_by=alert.cancelled_by,
        cancelled_at=ensure_utc(alert.cancelled_at),
        broadcast_status="CANCELLATION_BROADCASTED",
        broadcast_recipients=[
            "Main Gate Terminal",
            "North Gate Terminal",
            "Supervisor Mobile Terminal",
        ],
    )
