from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from server.database import get_db
from server.models import MaintenanceEvent, Component, User
from server.schemas import MaintenanceEventCreate, MaintenanceEventResponse
from server.auth import require_role

router = APIRouter()


@router.get("/inspections", response_model=List[MaintenanceEventResponse])
def list_inspections(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return (
        db.query(MaintenanceEvent)
        .order_by(MaintenanceEvent.scheduled_date.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post(
    "/inspections",
    response_model=MaintenanceEventResponse,
    status_code=status.HTTP_201_CREATED,
)
def schedule_inspection(
    payload: MaintenanceEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Engineer", "Admin"])),
):
    comp = db.query(Component).filter(Component.id == payload.component_id).first()
    if not comp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Component not found"
        )

    if payload.event_type not in ["Inspection", "Calibration"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event type must be 'Inspection' or 'Calibration'",
        )

    db_event = MaintenanceEvent(
        component_id=payload.component_id,
        event_type=payload.event_type,
        scheduled_date=payload.scheduled_date,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event
