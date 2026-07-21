from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from server.database import get_db
from server import crud, schemas

router = APIRouter(prefix="/equipment", tags=["equipment"])


@router.get("", response_model=List[schemas.EquipmentResponse])
def read_equipment_list(
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return crud.get_equipment_list(db=db, status=status, skip=skip, limit=limit)


@router.put("/{equipment_id}", response_model=schemas.EquipmentResponse)
def update_equipment(
    equipment_id: UUID,
    equipment: schemas.EquipmentUpdate,
    db: Session = Depends(get_db),
):
    db_equipment = crud.get_equipment(db=db, equipment_id=equipment_id)
    if db_equipment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Equipment not found"
        )
    try:
        return crud.update_equipment(
            db=db, db_equipment=db_equipment, equipment=equipment
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
