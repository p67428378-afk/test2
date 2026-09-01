import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.inmate import Inmate
from server.schemas.inmate import InmateCreate, InmateOut, InmateUpdate

router = APIRouter(prefix="/inmates", tags=["Inmates"])


@router.get("", response_model=List[InmateOut])
def list_inmates(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Inmate)
    if status_filter:
        query = query.filter(Inmate.status == status_filter.upper())
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Inmate.full_name.ilike(search_pattern))
            | (Inmate.inmate_number.ilike(search_pattern))
            | (Inmate.cell_location.ilike(search_pattern))
        )
    return query.order_by(Inmate.full_name.asc()).offset(skip).limit(limit).all()


@router.post("", response_model=InmateOut, status_code=status.HTTP_201_CREATED)
def create_inmate(inmate_in: InmateCreate, db: Session = Depends(get_db)):
    existing = (
        db.query(Inmate).filter(Inmate.inmate_number == inmate_in.inmate_number).first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inmate with this inmate number already exists.",
        )
    inmate = Inmate(
        id=uuid.uuid4(),
        inmate_number=inmate_in.inmate_number,
        full_name=inmate_in.full_name,
        cell_location=inmate_in.cell_location,
        status=inmate_in.status.upper() if inmate_in.status else "ACTIVE",
    )
    db.add(inmate)
    db.commit()
    db.refresh(inmate)
    return inmate


@router.get("/{id}", response_model=InmateOut)
def get_inmate(id: uuid.UUID, db: Session = Depends(get_db)):
    inmate = db.query(Inmate).filter(Inmate.id == id).first()
    if not inmate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inmate not found.",
        )
    return inmate


@router.patch("/{id}", response_model=InmateOut)
def update_inmate(
    id: uuid.UUID, inmate_update: InmateUpdate, db: Session = Depends(get_db)
):
    inmate = db.query(Inmate).filter(Inmate.id == id).first()
    if not inmate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inmate not found.",
        )
    if inmate_update.full_name is not None:
        inmate.full_name = inmate_update.full_name
    if inmate_update.cell_location is not None:
        inmate.cell_location = inmate_update.cell_location
    if inmate_update.status is not None:
        inmate.status = inmate_update.status.upper()

    db.commit()
    db.refresh(inmate)
    return inmate
