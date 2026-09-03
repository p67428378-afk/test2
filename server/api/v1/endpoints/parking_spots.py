from typing import List, Optional
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas.parking import (
    ParkingLocationCreate,
    ParkingLocationResponse,
    ParkingSpotSearchResult,
    RatesBreakdownResponse,
    CostCalculationRequest,
    CostCalculationResponse,
    StatusUpdateRequest,
    EventResponse,
)
from server.services.parking_service import ParkingService
from server.services.realtime_service import realtime_manager

router = APIRouter(prefix="/parking-spots", tags=["Parking Spots"])


@router.get(
    "/search",
    response_model=List[ParkingSpotSearchResult],
    summary="Search parking spots",
    description="Search nearby parking spots with distance calculation and category/amenity filters.",
)
def search_spots(
    lat: Optional[float] = Query(None, description="Latitude"),
    lng: Optional[float] = Query(None, description="Longitude"),
    radius_km: Optional[float] = Query(5.0, description="Search radius in kilometers"),
    max_rate: Optional[float] = Query(None, description="Maximum hourly rate filter"),
    spot_type: Optional[str] = Query(None, description="Spot facility type filter"),
    category: Optional[str] = Query(None, description="Vehicle category filter (e.g. Car, Bike)"),
    has_ev_charging: Optional[bool] = Query(None, description="EV charging requirement"),
    sort_by: Optional[str] = Query("distance", description="Sort order: distance, price, capacity, name"),
    db: Session = Depends(get_db),
):
    return ParkingService.search_spots(
        db=db,
        lat=lat,
        lng=lng,
        radius_km=radius_km,
        max_rate=max_rate,
        spot_type=spot_type,
        category=category,
        has_ev_charging=has_ev_charging,
        sort_by=sort_by,
    )


@router.get(
    "",
    response_model=List[ParkingLocationResponse],
    summary="List parking locations",
)
def list_spots(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return ParkingService.list_locations(db, skip=skip, limit=limit)


@router.post(
    "",
    response_model=ParkingLocationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create parking location",
)
def create_location(
    location_in: ParkingLocationCreate,
    db: Session = Depends(get_db),
):
    return ParkingService.create_location(db, location_in)


@router.get(
    "/events/recent",
    response_model=List[EventResponse],
    summary="Get recent status events",
)
def get_recent_events(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return ParkingService.get_recent_events(db, limit=limit)


@router.get(
    "/{spot_id}",
    response_model=ParkingLocationResponse,
    summary="Get parking spot details",
)
def get_spot_details(spot_id: str, db: Session = Depends(get_db)):
    return ParkingService.get_location_by_id(db, spot_id)


@router.get(
    "/{spot_id}/rates",
    response_model=RatesBreakdownResponse,
    summary="Get spot hourly rate breakdown",
)
def get_spot_rates(
    spot_id: str,
    target_date: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return ParkingService.get_spot_rates(db, spot_id, target_date)


@router.post(
    "/{spot_id}/calculate-cost",
    response_model=CostCalculationResponse,
    summary="Calculate estimated parking cost",
)
def calculate_cost(
    spot_id: str,
    payload: CostCalculationRequest,
    db: Session = Depends(get_db),
):
    return ParkingService.calculate_cost(
        db, spot_id, hours=payload.hours, start_time=payload.start_time
    )


@router.post(
    "/{spot_id}/status",
    response_model=ParkingLocationResponse,
    summary="Update spot availability status",
)
async def update_spot_status(
    spot_id: str,
    payload: StatusUpdateRequest,
    db: Session = Depends(get_db),
):
    updated = ParkingService.update_spot_status(
        db,
        spot_id,
        new_status=payload.status,
        available_spots=payload.available_spots,
    )
    # Broadcast realtime event
    await realtime_manager.broadcast(
        {
            "event": "status_change",
            "spot_id": updated.id,
            "status": updated.status,
            "available_spots": updated.available_spots,
            "category": updated.category,
        }
    )
    return updated


@router.websocket("/live-updates")
async def live_updates_ws(websocket: WebSocket):
    await realtime_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or process incoming ping
            await websocket.send_text(f'{{"ack": "{data}"}}')
    except WebSocketDisconnect:
        realtime_manager.disconnect(websocket)
