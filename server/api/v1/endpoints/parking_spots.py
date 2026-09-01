from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models.parking import ParkingLocation, HourlyRate, ParkingSpot
from server.schemas.parking import (
    ParkingSearchResponse,
    SpotOverviewItem,
    ParkingLocationDetailResponse,
    HourlyRateDetailResponse,
    ParkingLocationCreate,
    ParkingSpotStatusUpdate,
    CostEstimateRequest,
    CostEstimateResponse,
    ParkingSpotItem,
)
from server.services import parking_service
from server.services.realtime_service import manager

router = APIRouter()


@router.get("/search", response_model=ParkingSearchResponse)
def search_spots(
    lat: Optional[float] = Query(None, description="User or target latitude"),
    lng: Optional[float] = Query(None, description="User or target longitude"),
    address: Optional[str] = Query(
        None, description="Search address (e.g., '123 Main St')"
    ),
    radius_km: float = Query(
        5.0, ge=0.1, le=100.0, description="Search radius in kilometers"
    ),
    max_rate: Optional[float] = Query(
        None, ge=0.0, description="Filter spots at or below this hourly rate"
    ),
    spot_type: Optional[str] = Query(
        None,
        description="Filter by spot type ('covered', 'open_lot', 'street', 'garage')",
    ),
    has_ev_charging: Optional[bool] = Query(
        None, description="Filter by EV charging availability"
    ),
    status: Optional[str] = Query(
        None, description="Filter by spot status ('AVAILABLE', 'OCCUPIED')"
    ),
    sort_by: Optional[str] = Query(
        "distance",
        description="Sort by 'distance', 'price'/'rate', 'name', or 'capacity'",
    ),
    db: Session = Depends(get_db),
):
    """Search for nearby parking spots with filters and sorting."""
    spots_data = parking_service.search_parking_locations(
        db=db,
        lat=lat,
        lng=lng,
        address=address,
        radius_km=radius_km,
        max_rate=max_rate,
        spot_type=spot_type,
        has_ev_charging=has_ev_charging,
        status=status,
        sort_by=sort_by,
    )
    items = [SpotOverviewItem(**s) for s in spots_data]
    return ParkingSearchResponse(total=len(items), spots=items)


@router.get("", response_model=List[SpotOverviewItem])
def list_all_spots(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all registered parking locations with pagination."""
    spots_data = parking_service.search_parking_locations(
        db=db,
        lat=37.7749,
        lng=-122.4194,
        radius_km=100.0,
        sort_by="name",
    )
    items = [SpotOverviewItem(**s) for s in spots_data]
    return items[skip : skip + limit]


@router.get("/{spot_id}", response_model=ParkingLocationDetailResponse)
def get_spot_details(spot_id: str, db: Session = Depends(get_db)):
    """Retrieve full details of a specific parking facility or spot."""
    loc = parking_service.get_location_by_id(db, spot_id)
    if not loc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parking spot with ID '{spot_id}' not found",
        )

    loc_id_str = str(loc.id)
    rates_info = parking_service.get_rates_for_location(db, loc_id_str)
    now_utc = datetime.now(timezone.utc)
    active_rate, is_peak = parking_service.resolve_active_rate(loc.rates, now_utc)

    # Convert individual spots
    spot_items = [
        ParkingSpotItem(
            id=str(s.id),
            location_id=str(s.location_id),
            spot_number=str(s.spot_number),
            status=str(s.status),
            last_status_change=s.last_status_change,
        )
        for s in loc.spots
    ]

    base_rate_val = float(loc.rates.base_rate_per_hour) if loc.rates else 5.0

    return ParkingLocationDetailResponse(
        id=loc_id_str,
        name=str(loc.name),
        address=str(loc.address),
        latitude=float(loc.latitude),
        longitude=float(loc.longitude),
        spot_type=str(loc.spot_type),
        has_ev_charging=bool(loc.has_ev_charging),
        total_capacity=int(loc.total_capacity),
        available_spots=int(loc.available_spots),
        base_hourly_rate=base_rate_val,
        current_active_rate=float(active_rate),
        is_peak=bool(is_peak),
        rates=HourlyRateDetailResponse(**rates_info) if rates_info else None,
        individual_spots=spot_items,
        created_at=loc.created_at,
        updated_at=loc.updated_at,
    )


@router.get("/{spot_id}/rates", response_model=HourlyRateDetailResponse)
def get_spot_rates(
    spot_id: str,
    target_date: Optional[str] = Query(
        None, description="ISO timestamp for rate calculation"
    ),
    db: Session = Depends(get_db),
):
    """Retrieve hourly rate structure, peak/off-peak rules, and weekend rates."""
    rates = parking_service.get_rates_for_location(db, spot_id, target_date=target_date)
    if not rates:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rates for parking spot ID '{spot_id}' not found",
        )
    return HourlyRateDetailResponse(**rates)


@router.post("/{spot_id}/calculate-cost", response_model=CostEstimateResponse)
def calculate_parking_cost(
    spot_id: str,
    payload: CostEstimateRequest,
    db: Session = Depends(get_db),
):
    """Calculate estimated parking cost based on planned duration and arrival time."""
    estimate = parking_service.calculate_cost(
        db,
        location_or_spot_id=spot_id,
        hours=payload.hours,
        start_time=payload.start_time,
    )
    if not estimate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parking spot with ID '{spot_id}' not found",
        )
    return CostEstimateResponse(**estimate)


@router.post("/{spot_id}/status")
async def update_spot_status(
    spot_id: str,
    payload: ParkingSpotStatusUpdate,
    db: Session = Depends(get_db),
):
    """
    Ingest a real-time spot availability transition (e.g., from sensor, operator, or simulator).
    Broadcasts the change across active WebSocket listeners.
    """
    updated = parking_service.update_spot_or_location_status(
        db=db,
        spot_or_location_id=spot_id,
        status=payload.status,
        available_spots=payload.available_spots,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parking spot with ID '{spot_id}' not found",
        )

    # Broadcast real-time event
    event = {
        "event": "SPOT_STATUS_CHANGED",
        "spot_id": updated["spot_id"],
        "facility": updated["name"],
        "status": updated["status"],
        "available_spots": updated["available_spots"],
        "total_capacity": updated["total_capacity"],
        "timestamp": updated["timestamp"],
    }
    await manager.broadcast_event(event)

    return {
        "message": "Status updated successfully",
        "data": updated,
    }


@router.post("", status_code=status.HTTP_201_CREATED)
def create_parking_location(
    payload: ParkingLocationCreate,
    db: Session = Depends(get_db),
):
    """Create a new parking location facility."""
    avail = (
        payload.available_spots
        if payload.available_spots is not None
        else payload.total_capacity
    )
    loc = ParkingLocation(
        name=payload.name,
        address=payload.address,
        latitude=payload.latitude,
        longitude=payload.longitude,
        spot_type=payload.spot_type,
        has_ev_charging=payload.has_ev_charging,
        total_capacity=payload.total_capacity,
        available_spots=avail,
    )
    db.add(loc)
    db.flush()

    rate = HourlyRate(
        location_id=loc.id,
        base_rate_per_hour=payload.base_hourly_rate,
        peak_rate_per_hour=payload.peak_rate_per_hour
        or (payload.base_hourly_rate * 1.5),
        weekend_rate_per_hour=payload.weekend_rate_per_hour
        or (payload.base_hourly_rate * 1.2),
        max_daily_rate=payload.max_daily_rate or (payload.base_hourly_rate * 7.0),
    )
    db.add(rate)

    # Generate initial spots
    for i in range(1, min(11, payload.total_capacity + 1)):
        spot_status = "AVAILABLE" if i <= avail else "OCCUPIED"
        spot = ParkingSpot(
            location_id=loc.id,
            spot_number=f"{payload.name[:3].upper()}-{i:02d}",
            status=spot_status,
        )
        db.add(spot)

    db.commit()
    db.refresh(loc)

    return {
        "message": "Parking location created successfully",
        "id": loc.id,
        "name": loc.name,
    }
