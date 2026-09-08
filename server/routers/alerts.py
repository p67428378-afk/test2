from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import SecurityAlert, User
from server.schemas import AlertCreate, AlertCancel, AlertResponse

router = APIRouter(prefix="/api/v1/alerts", tags=["alerts"])


@router.post("", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
def create_alert(data: AlertCreate, db: Session = Depends(get_db)):
    reporter = (
        db.query(User).filter(User.role.in_(["guard", "supervisor", "admin"])).first()
    )
    reporter_id = reporter.id if reporter else None

    location = data.location or data.location_tag or "Main Gate"

    alert = SecurityAlert(
        reporter_id=reporter_id,
        severity=data.severity,
        alert_type=data.alert_type,
        location_tag=location,
        description=data.description,
        status="ACTIVE",
        created_at=datetime.utcnow(),
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    return AlertResponse.model_validate(alert)


@router.post("/{id}/cancel", response_model=AlertResponse)
def cancel_alert(id: str, data: AlertCancel, db: Session = Depends(get_db)):
    alert = db.query(SecurityAlert).filter(SecurityAlert.id == id).first()
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Security alert record not found",
        )

    elapsed_seconds = (datetime.utcnow() - alert.created_at).total_seconds()
    if elapsed_seconds > 60:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cancellation window (60s) expired",
        )

    alert.status = "CANCELLED"
    alert.cancel_reason = data.cancel_reason
    alert.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)

    return AlertResponse.model_validate(alert)


@router.get("", response_model=List[AlertResponse])
def list_alerts(status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(SecurityAlert)
    if status_filter:
        query = query.filter(SecurityAlert.status == status_filter)
    alerts = query.order_by(SecurityAlert.created_at.desc()).all()

    return [AlertResponse.model_validate(a) for a in alerts]
