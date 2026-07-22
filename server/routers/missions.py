from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import date

from server.database import get_db
from server.models import Mission, Component, MissionEquipment, User
from server.schemas import (
    MissionCreate,
    MissionResponse,
    MissionEquipmentAssignment,
    ComponentListResponse,
    DetailResponse,
)
from server.auth import require_role

router = APIRouter()


@router.get("/missions", response_model=List[MissionResponse])
def list_missions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return (
        db.query(Mission)
        .order_by(Mission.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post(
    "/missions", response_model=MissionResponse, status_code=status.HTTP_201_CREATED
)
def create_mission(
    payload: MissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Engineer", "Admin"])),
):
    db_mission = Mission(
        name=payload.name, launch_date=payload.launch_date, status=payload.status
    )
    db.add(db_mission)
    db.commit()
    db.refresh(db_mission)
    return db_mission


@router.post("/missions/{id}/equipment", response_model=DetailResponse)
def assign_equipment_to_mission(
    id: uuid.UUID,
    payload: MissionEquipmentAssignment,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Engineer", "Admin"])),
):
    mission = db.query(Mission).filter(Mission.id == id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Mission not found"
        )

    comp = db.query(Component).filter(Component.id == payload.component_id).first()
    if not comp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Component not found"
        )

    # Check if already assigned
    existing = (
        db.query(MissionEquipment)
        .filter(
            MissionEquipment.mission_id == id,
            MissionEquipment.component_id == payload.component_id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Component is already assigned to this mission",
        )

    # 1. Out of service check
    if comp.status == "Out of Service":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Component is out of service",
        )

    # 2. Flagged for review check
    if comp.flagged_for_review and not comp.supervisor_approved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Component is flagged for engineering review and requires supervisor approval",
        )

    # 3. Uncertified check (no certifications)
    if not comp.certifications:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Component is uncertified"
        )

    # 4. Expired certification check
    today = date.today()
    for cert in comp.certifications:
        if cert.expiry_date < today:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Component certification '{cert.name}' is expired",
            )

    # Assign equipment
    assignment = MissionEquipment(mission_id=id, component_id=payload.component_id)
    db.add(assignment)

    # Update component status to 'Assigned'
    comp.status = "Assigned"

    db.commit()
    return {"detail": "Equipment assigned to mission successfully"}


@router.get("/missions/{id}/equipment", response_model=List[ComponentListResponse])
def get_mission_equipment(id: uuid.UUID, db: Session = Depends(get_db)):
    mission = db.query(Mission).filter(Mission.id == id).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Mission not found"
        )

    assignments = (
        db.query(MissionEquipment).filter(MissionEquipment.mission_id == id).all()
    )
    component_ids = [a.component_id for a in assignments]

    components = (
        db.query(Component).filter(Component.id.in_(component_ids)).all()
        if component_ids
        else []
    )

    result = []
    for comp in components:
        result.append(
            {
                "id": comp.id,
                "name": comp.name,
                "description": comp.description,
                "location": comp.location,
                "status": comp.status,
                "inventory_count": comp.inventory_count,
                "next_inspection": None,  # Can be calculated if needed
                "next_calibration": None,
                "created_at": comp.created_at,
                "updated_at": comp.updated_at,
            }
        )
    return result
