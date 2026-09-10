from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import (
    TouristPlaceResponse,
    TouristPlaceDetailResponse,
    TouristPlaceCreate,
    MediaAssetResponse,
    MediaAssetCreate,
)
from server import crud

router = APIRouter(prefix="/api/v1/tourist-places", tags=["Tourist Places"])


@router.get("", response_model=List[TouristPlaceResponse])
def list_tourist_places(
    response: Response,
    search: Optional[str] = Query(
        None, description="Search keyword in title, summary, description, district"
    ),
    district: Optional[str] = Query(
        None, description="Filter by district (e.g. Wayanad, Alappuzha)"
    ),
    category_id: Optional[str] = Query(None, description="Filter by Category UUID"),
    best_time_to_visit: Optional[str] = Query(
        None, description="Filter by best season/month"
    ),
    min_fee: Optional[float] = Query(None, ge=0, description="Minimum entry fee"),
    max_fee: Optional[float] = Query(None, ge=0, description="Maximum entry fee"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List tourist places with multi-criteria search and filters."""
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"
    return crud.get_tourist_places(
        db,
        search=search,
        district=district,
        category_id=category_id,
        best_time_to_visit=best_time_to_visit,
        min_fee=min_fee,
        max_fee=max_fee,
        skip=skip,
        limit=limit,
    )


@router.get("/{place_id}", response_model=TouristPlaceDetailResponse)
def get_tourist_place(place_id: str, response: Response, db: Session = Depends(get_db)):
    """Retrieve detailed profile for a tourist spot including gallery, reviews, and nearby attractions within 50 km."""
    place = crud.get_tourist_place(db, place_id)
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tourist place with ID {place_id} not found",
        )

    nearby = crud.get_nearby_attractions(db, place_id, radius_km=50.0)

    # Build response model
    detail = TouristPlaceDetailResponse.model_validate(place)
    detail.nearby_attractions = nearby
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=300"
    return detail


@router.post(
    "", response_model=TouristPlaceResponse, status_code=status.HTTP_201_CREATED
)
def create_tourist_place(place: TouristPlaceCreate, db: Session = Depends(get_db)):
    """Create a new tourist place."""
    category = crud.get_category(db, place.category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with ID '{place.category_id}' does not exist",
        )
    return crud.create_tourist_place(db, place)


@router.post(
    "/{place_id}/media",
    response_model=MediaAssetResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_media_asset(
    place_id: str,
    media_type: str = "image",
    url: str = Query(..., description="Media image or video URL"),
    caption: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Add a photo or video media asset to a tourist place."""
    place = crud.get_tourist_place(db, place_id)
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tourist place with ID {place_id} not found",
        )
    media = MediaAssetCreate(
        place_id=place_id, media_type=media_type, url=url, caption=caption
    )
    return crud.create_media_asset(db, media)
