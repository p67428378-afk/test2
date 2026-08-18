from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Tour, User
from server.schemas import TourCreate, TourUpdate, TourResponse
from server.auth import require_roles

router = APIRouter(prefix="/api/v1/tours", tags=["Tours"])


@router.get("", response_model=List[TourResponse])
def list_tours(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    tours = db.query(Tour).offset(skip).limit(limit).all()
    return tours


@router.get("/{tour_id}", response_model=TourResponse)
def get_tour(tour_id: str, db: Session = Depends(get_db)):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found",
        )
    return tour


@router.post("", response_model=TourResponse, status_code=status.HTTP_201_CREATED)
def create_tour(
    tour_in: TourCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Administrator")),
):
    tour = Tour(
        name=tour_in.name,
        description=tour_in.description,
        duration_minutes=tour_in.duration_minutes,
    )
    db.add(tour)
    db.commit()
    db.refresh(tour)
    return tour


@router.put("/{tour_id}", response_model=TourResponse)
def update_tour(
    tour_id: str,
    tour_in: TourUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Administrator")),
):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found",
        )

    if tour_in.name is not None:
        tour.name = tour_in.name
    if tour_in.description is not None:
        tour.description = tour_in.description
    if tour_in.duration_minutes is not None:
        tour.duration_minutes = tour_in.duration_minutes

    db.commit()
    db.refresh(tour)
    return tour


@router.delete("/{tour_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tour(
    tour_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Administrator")),
):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tour not found",
        )
    db.delete(tour)
    db.commit()
    return None
