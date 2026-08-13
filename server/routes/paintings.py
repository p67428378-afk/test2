from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import math

from server.database import get_db
from server.models import Painting
from server.schemas import (
    PaintingCreate,
    PaintingUpdate,
    PaintingResponse,
    PaintingListResponse,
)

router = APIRouter(prefix="/api/v1/paintings", tags=["paintings"])


@router.get("", response_model=PaintingListResponse)
def get_paintings(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1),
    db: Session = Depends(get_db),
):
    total = db.query(Painting).count()
    items = db.query(Painting).offset(skip).limit(limit).all()

    page = (skip // limit) + 1
    pages = math.ceil(total / limit) if total > 0 else 1

    return {"items": items, "page": page, "pages": pages, "total": total}


@router.get("/{painting_id}", response_model=PaintingResponse)
def get_painting(painting_id: str, db: Session = Depends(get_db)):
    painting = db.query(Painting).filter(Painting.id == painting_id).first()
    if not painting:
        raise HTTPException(status_code=404, detail="Painting not found")
    return painting


@router.post("", response_model=PaintingResponse, status_code=status.HTTP_201_CREATED)
def create_painting(painting_in: PaintingCreate, db: Session = Depends(get_db)):
    painting = Painting(**painting_in.dict())
    db.add(painting)
    db.commit()
    db.refresh(painting)
    return painting


@router.put("/{painting_id}", response_model=PaintingResponse)
def update_painting(
    painting_id: str, painting_in: PaintingUpdate, db: Session = Depends(get_db)
):
    painting = db.query(Painting).filter(Painting.id == painting_id).first()
    if not painting:
        raise HTTPException(status_code=404, detail="Painting not found")

    for field, value in painting_in.dict().items():
        setattr(painting, field, value)

    db.commit()
    db.refresh(painting)
    return painting


@router.delete("/{painting_id}")
def delete_painting(painting_id: str, db: Session = Depends(get_db)):
    painting = db.query(Painting).filter(Painting.id == painting_id).first()
    if not painting:
        raise HTTPException(status_code=404, detail="Painting not found")

    db.delete(painting)
    db.commit()
    return {"message": "Painting deleted successfully"}
