from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Tour
from server.schemas import TourCreate, TourUpdate, TourResponse

router = APIRouter(prefix="/api/v1/tours", tags=["Tours"])


@router.get("", response_model=List[TourResponse])
def list_tours(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Tour)
    if search:
        query = query.filter(Tour.title.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=TourResponse, status_code=status.HTTP_201_CREATED)
def create_tour(
    tour_in: TourCreate,
    db: Session = Depends(get_db),
):
    tour = Tour(
        title=tour_in.title,
        description=tour_in.description,
        duration_minutes=tour_in.duration_minutes,
    )
    db.add(tour)
    db.commit()
    db.refresh(tour)
    return tour


@router.get("/{tour_id}", response_model=TourResponse)
def get_tour(
    tour_id: str,
    db: Session = Depends(get_db),
):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with ID '{tour_id}' not found",
        )
    return tour


@router.put("/{tour_id}", response_model=TourResponse)
def update_tour(
    tour_id: str,
    tour_in: TourUpdate,
    db: Session = Depends(get_db),
):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with ID '{tour_id}' not found",
        )

    update_data = tour_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tour, field, value)

    db.commit()
    db.refresh(tour)
    return tour


@router.delete("/{tour_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tour(
    tour_id: str,
    db: Session = Depends(get_db),
):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with ID '{tour_id}' not found",
        )
    db.delete(tour)
    db.commit()
    return None
