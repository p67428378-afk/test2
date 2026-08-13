from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import models, schemas
from server.auth import require_admin
from server.services.rental_service import is_equipment_available

router = APIRouter(prefix="/api/v1/equipment", tags=["Equipment Catalog"])


@router.get("", response_model=List[schemas.EquipmentResponse])
def get_equipment_catalog(
    category: Optional[str] = Query(
        None, description="Category filter (CAMERAS, DRONES, CONSTRUCTION_TOOLS)"
    ),
    status_filter: Optional[str] = Query(
        None,
        alias="status",
        description="Status filter (AVAILABLE, RESERVED, CHECKED_OUT, MAINTENANCE)",
    ),
    start_date: Optional[datetime] = Query(
        None, description="Rental start date for availability check"
    ),
    end_date: Optional[datetime] = Query(
        None, description="Rental end date for availability check"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(models.Equipment)

    if category:
        query = query.filter(models.Equipment.category == category.upper())

    if status_filter:
        query = query.filter(models.Equipment.status == status_filter.upper())
    else:
        # Exclude MAINTENANCE items from default active booking selection if date range is specified
        if start_date and end_date:
            query = query.filter(models.Equipment.status != "MAINTENANCE")

    equipment_items = query.offset(skip).limit(limit).all()

    # Filter out items unavailable for specified date range
    if start_date and end_date:
        available_items = []
        for eq in equipment_items:
            if is_equipment_available(db, eq.id, start_date, end_date):
                available_items.append(eq)
        return available_items

    return equipment_items


@router.post("", response_model=schemas.EquipmentResponse, status_code=201)
def create_equipment(
    eq_in: schemas.EquipmentCreate,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin),
):
    equipment = models.Equipment(
        name=eq_in.name,
        category=eq_in.category.upper(),
        daily_rate=eq_in.daily_rate,
        deposit_amount=eq_in.deposit_amount,
        status="AVAILABLE",
        specifications=eq_in.specifications or {},
        version=1,
    )
    db.add(equipment)
    db.commit()
    db.refresh(equipment)
    return equipment


@router.get("/{equipment_id}", response_model=schemas.EquipmentResponse)
def get_equipment_detail(equipment_id: str, db: Session = Depends(get_db)):
    equipment = (
        db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    )
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found"
        )
    return equipment


@router.patch("/{equipment_id}", response_model=schemas.EquipmentResponse)
def update_equipment(
    equipment_id: str,
    eq_in: schemas.EquipmentUpdate,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin),
):
    equipment = (
        db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    )
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found"
        )

    if eq_in.name is not None:
        equipment.name = eq_in.name
    if eq_in.category is not None:
        equipment.category = eq_in.category.upper()
    if eq_in.daily_rate is not None:
        equipment.daily_rate = eq_in.daily_rate
    if eq_in.deposit_amount is not None:
        equipment.deposit_amount = eq_in.deposit_amount
    if eq_in.status is not None:
        equipment.status = eq_in.status.upper()
    if eq_in.specifications is not None:
        equipment.specifications = eq_in.specifications

    equipment.version += 1
    db.commit()
    db.refresh(equipment)
    return equipment
