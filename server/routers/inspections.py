from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Inspection, Hive
from server.schemas import InspectionCreate, InspectionUpdate, InspectionResponse

router = APIRouter(prefix="/api/v1/inspections", tags=["Inspections"])


@router.get("", response_model=List[InspectionResponse])
def list_inspections(
    hive_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(Inspection)
    if hive_id:
        query = query.filter(Inspection.hive_id == hive_id)
    if status_filter:
        query = query.filter(Inspection.status == status_filter)

    inspections = (
        query.order_by(Inspection.scheduled_date.asc()).offset(skip).limit(limit).all()
    )
    return inspections


@router.post("", response_model=InspectionResponse, status_code=status.HTTP_201_CREATED)
def create_inspection(payload: InspectionCreate, db: Session = Depends(get_db)):
    hive = db.query(Hive).filter(Hive.id == payload.hive_id).first()
    if not hive:
        raise HTTPException(
            status_code=404, detail=f"Hive '{payload.hive_id}' not found."
        )

    inspection = Inspection(
        hive_id=payload.hive_id,
        scheduled_date=payload.scheduled_date,
        inspector_name=payload.inspector_name,
        status=payload.status,
        notes=payload.notes,
    )
    db.add(inspection)
    db.commit()
    db.refresh(inspection)
    return inspection


@router.patch("/{inspection_id}", response_model=InspectionResponse)
def update_inspection(
    inspection_id: str, payload: InspectionUpdate, db: Session = Depends(get_db)
):
    inspection = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not inspection:
        raise HTTPException(
            status_code=404, detail=f"Inspection with ID '{inspection_id}' not found."
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(inspection, field, value)

    db.commit()
    db.refresh(inspection)
    return inspection
