from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import uuid

from server.database import get_db
from server.models import Component, MaintenanceEvent, User
from server.schemas import (
    ComponentCreate,
    ComponentUpdate,
    ComponentListResponse,
    ComponentDetailResponse,
    DetailResponse,
)
from server.auth import require_role

router = APIRouter()


@router.get("/components", response_model=List[ComponentListResponse])
def list_components(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    query = db.query(Component)
    if status_filter:
        query = query.filter(Component.status == status_filter)

    # Order by created_at to ensure stable ordering
    components = (
        query.order_by(Component.created_at.desc()).offset(skip).limit(limit).all()
    )

    result = []
    for comp in components:
        # Find next scheduled inspection
        next_insp = (
            db.query(MaintenanceEvent.scheduled_date)
            .filter(
                MaintenanceEvent.component_id == comp.id,
                MaintenanceEvent.event_type == "Inspection",
                MaintenanceEvent.completion_date == None,
            )
            .order_by(MaintenanceEvent.scheduled_date.asc())
            .first()
        )

        # Find next scheduled calibration
        next_cal = (
            db.query(MaintenanceEvent.scheduled_date)
            .filter(
                MaintenanceEvent.component_id == comp.id,
                MaintenanceEvent.event_type == "Calibration",
                MaintenanceEvent.completion_date == None,
            )
            .order_by(MaintenanceEvent.scheduled_date.asc())
            .first()
        )

        result.append(
            {
                "id": comp.id,
                "name": comp.name,
                "description": comp.description,
                "location": comp.location,
                "status": comp.status,
                "inventory_count": comp.inventory_count,
                "next_inspection": next_insp[0] if next_insp else None,
                "next_calibration": next_cal[0] if next_cal else None,
                "created_at": comp.created_at,
                "updated_at": comp.updated_at,
            }
        )

    return result


@router.post(
    "/components",
    response_model=ComponentDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_component(
    payload: ComponentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Engineer", "Admin"])),
):
    # Verify responsible engineer exists if provided
    if payload.responsible_engineer_id:
        eng = db.query(User).filter(User.id == payload.responsible_engineer_id).first()
        if not eng:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Responsible engineer not found",
            )

    db_comp = Component(
        name=payload.name,
        description=payload.description,
        location=payload.location,
        status=payload.status,
        inventory_count=payload.inventory_count,
        flagged_for_review=payload.flagged_for_review,
        supervisor_approved=payload.supervisor_approved,
        responsible_engineer_id=payload.responsible_engineer_id,
    )
    db.add(db_comp)
    db.commit()
    db.refresh(db_comp)
    return db_comp


@router.get("/components/{id}", response_model=ComponentDetailResponse)
def get_component(id: uuid.UUID, db: Session = Depends(get_db)):
    comp = (
        db.query(Component)
        .options(
            joinedload(Component.certifications),
            joinedload(Component.maintenance_events),
        )
        .filter(Component.id == id)
        .first()
    )

    if not comp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Component not found"
        )
    return comp


@router.put("/components/{id}", response_model=ComponentDetailResponse)
def update_component(
    id: uuid.UUID,
    payload: ComponentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Engineer", "Admin"])),
):
    comp = db.query(Component).filter(Component.id == id).first()
    if not comp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Component not found"
        )

    # Verify responsible engineer exists if provided
    if payload.responsible_engineer_id:
        eng = db.query(User).filter(User.id == payload.responsible_engineer_id).first()
        if not eng:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Responsible engineer not found",
            )

    comp.name = payload.name
    comp.description = payload.description
    comp.location = payload.location
    comp.status = payload.status
    comp.inventory_count = payload.inventory_count
    comp.flagged_for_review = payload.flagged_for_review
    comp.supervisor_approved = payload.supervisor_approved
    comp.responsible_engineer_id = payload.responsible_engineer_id

    db.commit()
    db.refresh(comp)
    return comp


@router.delete("/components/{id}", response_model=DetailResponse)
def delete_component(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Engineer", "Admin"])),
):
    comp = db.query(Component).filter(Component.id == id).first()
    if not comp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Component not found"
        )

    db.delete(comp)
    db.commit()
    return {"detail": "Component deleted successfully"}
