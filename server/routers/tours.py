from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Tour
from server.schemas import TourCreate, TourUpdate, TourResponse

router = APIRouter(prefix="/api/v1/tours", tags=["Tours"])


@router.get("", response_model=List[TourResponse])
@router.get("/", response_model=List[TourResponse], include_in_schema=False)
def list_tours(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Tour)
    if search:
        query = query.filter(Tour.title.ilike(f"%{search}%"))
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=TourResponse, status_code=status.HTTP_201_CREATED)
@router.post(
    "/",
    response_model=TourResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_tour(
    tour_in: TourCreate,
    db: Session = Depends(get_db),
):
    existing = db.query(Tour).filter(Tour.title == tour_in.title).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A tour with this title already exists.",
        )
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
    tour = db.query(Tour).filter(Tour.id == id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with id '{id}' not found.",
        )
    return tour


@router.put("/{id}", response_model=TourResponse)
def update_tour(
    id: str,
    tour_in: TourUpdate,
    db: Session = Depends(get_db),
):
    tour = db.query(Tour).filter(Tour.id == id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with id '{id}' not found.",
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


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tour(
    id: str,
    db: Session = Depends(get_db),
):
    tour = db.query(Tour).filter(Tour.id == id).first()
    if not tour:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tour with id '{id}' not found.",
        )
    db.delete(tour)
    db.commit()
    return None
