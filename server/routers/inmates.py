from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas

router = APIRouter(prefix="/api/v1/inmates", tags=["Inmates"])


@router.get("", response_model=List[schemas.InmateResponse])
def list_inmates(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Inmate)
    if search:
        query = query.filter(
            (models.Inmate.full_name.ilike(f"%{search}%"))
            | (models.Inmate.inmate_number.ilike(f"%{search}%"))
            | (models.Inmate.cell_location.ilike(f"%{search}%"))
        )
    if status_filter:
        query = query.filter(models.Inmate.status == status_filter.upper())
    return query.order_by(models.Inmate.full_name.asc()).offset(skip).limit(limit).all()


@router.post(
    "", response_model=schemas.InmateResponse, status_code=status.HTTP_201_CREATED
)
def create_inmate(inmate_in: schemas.InmateCreate, db: Session = Depends(get_db)):
    clean_num = inmate_in.inmate_number.strip().upper()
    existing = (
        db.query(models.Inmate)
        .filter(models.Inmate.inmate_number.ilike(clean_num))
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inmate with this number already exists",
        )

    inmate = models.Inmate(
        inmate_number=clean_num,
        full_name=inmate_in.full_name.strip(),
        cell_location=inmate_in.cell_location.strip(),
        security_level=inmate_in.security_level.upper(),
        weekly_visit_limit=inmate_in.weekly_visit_limit,
        status=inmate_in.status.upper(),
    )
    db.add(inmate)
    db.commit()
    db.refresh(inmate)
    return inmate


@router.get("/{inmate_id}", response_model=schemas.InmateResponse)
def get_inmate(inmate_id: str, db: Session = Depends(get_db)):
    inmate = db.query(models.Inmate).filter(models.Inmate.id == inmate_id).first()
    if not inmate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Inmate not found"
        )
    return inmate
