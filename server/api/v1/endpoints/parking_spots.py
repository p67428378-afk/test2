from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.services.realtime_service import manager
from server.services import parking_service
from server.schemas.parking import (
    ParkingLocationCreate,
    ParkingSpotResponse,
    ParkingSearchResponse,
    HourlyRateResponse,
    CostCalculationRequest,
    CostCalculationResponse,
    SpotStatusUpdateRequest,
    SpotStatusUpdateResponse,
    SensorEventResponse,
)

router = APIRouter(prefix="/parking-spots", tags=["Parking Spots"])


@router.get("/search", response_model=ParkingSearchResponse)
def search_spots(
    lat: Optional[float] = Query(None, description="Search center latitude"),
    lng: Optional[float] = Query(None, description="Search center longitude"),
    address: Optional[str] = Query(None, description="Search address / place name"),
    radius_km: Optional[float] = Query(10.0, description="Search radius in kilometers"),
    max_rate: Optional[float] = Query(None, description="Maximum hourly rate filter"),
    spot_type: Optional[str] = Query(
        None, description="Spot type filter (covered, open_lot, street, garage)"
    ),
    has_ev_charging: Optional[bool] = Query(
        None, description="Filter for EV charging availability"
    ),
    sort_by: Optional[str] = Query(
        "distance", description="Sort by distance, price, or availability"
    ),
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(50, ge=1, le=100, description="Pagination limit"),
    db: Session = Depends(get_db),
):
    """Search for available parking spots near coordinates or address with filtering."""
    total, spots = parking_service.search_parking_spots(
        db=db,
        lat=lat,
        lng=lng,
        address=address,
        radius_km=radius_km if radius_km is not None else 10.0,
        max_rate=max_rate,
        spot_type=spot_type,
        has_ev_charging=has_ev_charging,
        sort_by=sort_by or "distance",
        skip=skip,
        limit=limit,
    )
    return ParkingSearchResponse(total=total, spots=spots)


@router.get("/events/recent", response_model=List[SensorEventResponse])
def get_recent_sensor_events(
    limit: int = Query(
        20, ge=1, le=100, description="Max number of recent events to return"
    ),
    db: Session = Depends(get_db),
):
    """Get the recent real-time sensor events buffer."""
    return parking_service.get_recent_events(db=db, limit=limit)


@router.get("", response_model=List[ParkingSpotResponse])
def list_spots(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all registered parking locations."""
    _, spots = parking_service.search_parking_spots(
        db=db,
        radius_km=1000.0,  # wide radius to list all
        skip=skip,
        limit=limit,
    )
    return spots


@router.post(
    "", response_model=ParkingSpotResponse, status_code=status.HTTP_201_CREATED
)
def create_parking_location(
    data: ParkingLocationCreate,
    db: Session = Depends(get_db),
):
    """Create a new parking facility with rates."""
    return parking_service.create_parking_location(db=db, data=data)


@router.get("/{spot_id}", response_model=ParkingSpotResponse)
def get_spot_details(
    spot_id: str,
    db: Session = Depends(get_db),
):
    """Get detailed information for a specific parking spot/location."""
    spot = parking_service.get_spot_details(db=db, spot_id=spot_id)
    if not spot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parking spot with ID '{spot_id}' not found",
        )
    return spot


@router.get("/{spot_id}/rates", response_model=HourlyRateResponse)
def get_spot_rates(
    spot_id: str,
    target_date: Optional[str] = Query(
        None, description="Optional target date/time for rate evaluation (ISO 8601)"
    ),
    db: Session = Depends(get_db),
):
    """Get the hourly rate structure and peak/off-peak breakdown for a parking location."""
    rates = parking_service.get_spot_rates(
        db=db, spot_id=spot_id, target_date=target_date
    )
    if not rates:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rates for parking spot ID '{spot_id}' not found",
        )
    return rates


@router.post("/{spot_id}/calculate-cost", response_model=CostCalculationResponse)
def calculate_parking_cost(
    spot_id: str,
    payload: CostCalculationRequest,
    db: Session = Depends(get_db),
):
    """Calculate estimated parking cost based on requested hours and arrival time."""
    result = parking_service.calculate_cost(
        db=db,
        spot_id=spot_id,
        hours=payload.hours,
        start_time=payload.start_time,
    )
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parking spot with ID '{spot_id}' not found",
        )
    return result


@router.post("/{spot_id}/status", response_model=SpotStatusUpdateResponse)
async def update_spot_status(
    spot_id: str,
    payload: SpotStatusUpdateRequest,
    db: Session = Depends(get_db),
):
    """Ingest a sensor or manual status transition and broadcast via WebSocket."""
    result = parking_service.update_spot_status(
        db=db,
        spot_id=spot_id,
        status=payload.status,
        available_spots=payload.available_spots,
    )
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parking spot with ID '{spot_id}' not found",
        )

    response_data, broadcast_payload = result

    # Broadcast event asynchronously to all connected WebSockets
    await manager.broadcast(broadcast_payload)

    return response_data
