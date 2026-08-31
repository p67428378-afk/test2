from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Tour
from server.schemas import TourCreate, TourResponse, TourUpdate

router = APIRouter(prefix="/api/v1/tours", tags=["Tours"])


@router.get("", response_model=List[TourResponse])
def list_tours(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List available tour routes with pagination."""
    tours = db.query(Tour).order_by(Tour.created_at).offset(skip).limit(limit).all()
    return tours


@router.post("", response_model=TourResponse, status_code=status.HTTP_201_CREATED)
def create_tour(tour_in: TourCreate, db: Session = Depends(get_db)):
    """Create a new tour route definition."""
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
def get_tour(tour_id: str, db: Session = Depends(get_db)):
    """Retrieve a single tour by ID."""
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with ID '{tour_id}' not found",
        )
    return tour


@router.put("/{tour_id}", response_model=TourResponse)
def update_tour(tour_id: str, tour_in: TourUpdate, db: Session = Depends(get_db)):
    """Update an existing tour route."""
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with ID '{tour_id}' not found",
        )

    if tour_in.title is not None:
        tour.title = tour_in.title
    if tour_in.description is not None:
        tour.description = tour_in.description
    if tour_in.duration_minutes is not None:
        tour.duration_minutes = tour_in.duration_minutes

    db.commit()
    db.refresh(tour)
    return tour


@router.delete("/{tour_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tour(tour_id: str, db: Session = Depends(get_db)):
    """Delete a tour route."""
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with ID '{tour_id}' not found",
        )
    db.delete(tour)
    db.commit()
    return None
