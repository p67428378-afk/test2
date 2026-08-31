"""Tour route management endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Tour
from server.schemas import TourCreate, TourResponse, TourUpdate

router = APIRouter(prefix="/api/v1/tours", tags=["Tours"])


@router.get("", response_model=List[TourResponse])
def list_tours(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search tour title or description"),
    db: Session = Depends(get_db),
):
    """List available tour routes."""
    query = db.query(Tour)
    if search:
        query = query.filter(
            (Tour.title.ilike(f"%{search}%")) | (Tour.description.ilike(f"%{search}%"))
        )
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=TourResponse, status_code=status.HTTP_201_CREATED)
def create_tour(
    tour_in: TourCreate,
    db: Session = Depends(get_db),
):
    """Create a new museum tour route definition."""
    tour = Tour(
        title=tour_in.title,
        description=tour_in.description,
        duration_minutes=tour_in.duration_minutes,
    )
    db.add(tour)
    db.commit()
    db.refresh(tour)
    return tour


@router.get("/{id}", response_model=TourResponse)
def get_tour(
    id: str,
    db: Session = Depends(get_db),
):
    """Get a specific tour route by ID."""
    tour = db.query(Tour).filter(Tour.id == id).first()
    if not tour:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour not found")
    return tour


@router.put("/{id}", response_model=TourResponse)
def update_tour(
    id: str,
    tour_in: TourUpdate,
    db: Session = Depends(get_db),
):
    """Update a tour route definition."""
    tour = db.query(Tour).filter(Tour.id == id).first()
    if not tour:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour not found")

    if tour_in.title is not None:
        tour.title = tour_in.title
    if tour_in.description is not None:
        tour.description = tour_in.description
    if tour_in.duration_minutes is not None:
        tour.duration_minutes = tour_in.duration_minutes

    db.commit()
    db.refresh(tour)
    return tour


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tour(
    id: str,
    db: Session = Depends(get_db),
):
    """Delete a tour route."""
    tour = db.query(Tour).filter(Tour.id == id).first()
    if not tour:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tour not found")
    db.delete(tour)
    db.commit()
    return None
