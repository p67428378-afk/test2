import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models.parking import HourlyRate, ParkingLocation, ParkingSpot
from server.schemas.parking import (
    CalculateCostRequest,
    CalculateCostResponse,
    ParkingLocationCreate,
    ParkingLocationDetail,
    RateBreakdownResponse,
    SensorEventResponse,
    SpotSearchItem,
    SpotSearchResponse,
    SpotStatusResponse,
    SpotStatusUpdate,
)
from server.services.parking_service import (
    evaluate_spot_rate,
    get_rate_breakdown_dict,
    search_parking_locations,
)
from server.services.realtime_service import manager

router = APIRouter(prefix="/parking-spots", tags=["parking-spots"])


@router.get("/search", response_model=SpotSearchResponse)
def search_spots(
    lat: Optional[float] = Query(None, description="Latitude for spatial search"),
    lng: Optional[float] = Query(None, description="Longitude for spatial search"),
    address: Optional[str] = Query(None, description="Street address or landmark"),
    radius_km: Optional[float] = Query(None, description="Search radius in kilometers"),
    max_rate: Optional[float] = Query(None, description="Maximum hourly rate filter"),
    spot_type: Optional[str] = Query(None, description="Spot type filter (e.g. garage, covered, open_lot, street)"),
    has_ev_charging: Optional[bool] = Query(None, description="Filter for EV charging stations"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by availability status"),
    sort_by: Optional[str] = Query("distance", description="Sort by distance, price, available_spots"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    spots, total = search_parking_locations(
        db=db,
        lat=lat,
        lng=lng,
        address=address,
        radius_km=radius_km,
        max_rate=max_rate,
        spot_type=spot_type,
        has_ev_charging=has_ev_charging,
        status_filter=status_filter,
        sort_by=sort_by,
        skip=skip,
        limit=limit,
    )
    return SpotSearchResponse(total=total, spots=spots)


@router.get("/events/recent", response_model=List[SensorEventResponse])
def get_recent_sensor_events(limit: int = Query(20, ge=1, le=100)):
    events = manager.get_recent_events(limit=limit)
    return events


@router.get("", response_model=List[SpotSearchItem])
def list_spots(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    spots, _ = search_parking_locations(db=db, skip=skip, limit=limit)
    return spots


@router.get("/{spot_id}", response_model=ParkingLocationDetail)
def get_spot_details(spot_id: str, db: Session = Depends(get_db)):
    loc = db.query(ParkingLocation).filter(ParkingLocation.id == spot_id).first()
    if not loc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Parking location {spot_id} not found")

    now_utc = datetime.now(timezone.utc)
    active_rate, is_peak = evaluate_spot_rate(loc.rates, now_utc)
    base_rate = float(loc.rates.base_rate_per_hour) if loc.rates else 5.00
    available_count = sum(1 for s in loc.spots if s.status.upper() == "AVAILABLE")
    loc_status = "AVAILABLE" if available_count > 0 else "OCCUPIED"

    rates_dict = get_rate_breakdown_dict(loc, loc.rates, now_utc)

    return ParkingLocationDetail(
        id=loc.id,
        spot_id=loc.id,
        name=loc.name,
        address=loc.address,
        latitude=loc.latitude,
        longitude=loc.longitude,
        spot_type=loc.spot_type,
        has_ev_charging=loc.has_ev_charging,
        total_capacity=loc.total_capacity,
        available_spots=available_count,
        status=loc_status,
        hourly_rate=active_rate,
        base_hourly_rate=base_rate,
        current_active_rate=active_rate,
        is_peak=is_peak,
        is_peak_hours=is_peak,
        currency=loc.rates.currency if loc.rates else "USD",
        rates=RateBreakdownResponse(**rates_dict),
        spots=loc.spots,
        created_at=loc.created_at,
        updated_at=loc.updated_at,
    )


@router.get("/{spot_id}/rates", response_model=RateBreakdownResponse)
def get_spot_rates(
    spot_id: str,
    target_date: Optional[str] = Query(None, description="Target datetime string (ISO 8601)"),
    db: Session = Depends(get_db),
):
    loc = db.query(ParkingLocation).filter(ParkingLocation.id == spot_id).first()
    if not loc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Parking location {spot_id} not found")

    dt = None
    if target_date:
        try:
            dt = datetime.fromisoformat(target_date.replace("Z", "+00:00"))
        except Exception:
            pass

    rates_dict = get_rate_breakdown_dict(loc, loc.rates, dt)
    return RateBreakdownResponse(**rates_dict)


@router.post("/{spot_id}/calculate-cost", response_model=CalculateCostResponse)
def calculate_cost(
    spot_id: str,
    payload: CalculateCostRequest,
    db: Session = Depends(get_db),
):
    loc = db.query(ParkingLocation).filter(ParkingLocation.id == spot_id).first()
    if not loc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Parking location {spot_id} not found")

    dt = None
    if payload.start_time:
        try:
            dt = datetime.fromisoformat(payload.start_time.replace("Z", "+00:00"))
        except Exception:
            pass

    active_rate, is_peak = evaluate_spot_rate(loc.rates, dt)
    base_cost = active_rate * payload.hours
    max_daily = float(loc.rates.max_daily_rate) if (loc.rates and loc.rates.max_daily_rate) else 35.00

    # Cap by max daily rate if parking duration is a full day or cost exceeds cap
    if payload.hours >= 24:
        days = payload.hours / 24.0
        final_cost = round(min(base_cost, days * max_daily), 2)
    else:
        final_cost = round(min(base_cost, max_daily), 2)

    peak_text = " (Peak Rate)" if is_peak else " (Standard Rate)"
    breakdown_text = f"{payload.hours} hr(s) @ ${active_rate:.2f}/hr{peak_text}"

    return CalculateCostResponse(
        spot_id=loc.id,
        hours=payload.hours,
        estimated_cost=final_cost,
        currency=loc.rates.currency if loc.rates else "USD",
        rate_applied=active_rate,
        breakdown=breakdown_text,
    )


@router.post("/{spot_id}/status", response_model=SpotStatusResponse)
async def update_spot_status(
    spot_id: str,
    payload: SpotStatusUpdate,
    db: Session = Depends(get_db),
):
    loc = db.query(ParkingLocation).filter(ParkingLocation.id == spot_id).first()
    if not loc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Parking location {spot_id} not found")

    now_utc = datetime.now(timezone.utc)

    # If updating a specific spot
    if payload.spot_number:
        spot = db.query(ParkingSpot).filter(
            ParkingSpot.location_id == spot_id,
            ParkingSpot.spot_number == payload.spot_number,
        ).first()
        if spot and payload.status:
            spot.status = payload.status.upper()
            spot.last_status_change = now_utc

    # If updating general available spots count
    if payload.available_spots is not None:
        target_available = max(0, min(loc.total_capacity, payload.available_spots))
        for idx, s in enumerate(loc.spots):
            if idx < target_available:
                s.status = "AVAILABLE"
            else:
                s.status = "OCCUPIED"
            s.last_status_change = now_utc
    elif payload.status:
        st = payload.status.upper()
        if st == "OCCUPIED":
            # Set all or top spots to occupied
            for s in loc.spots:
                s.status = "OCCUPIED"
                s.last_status_change = now_utc
        elif st == "AVAILABLE":
            for s in loc.spots:
                s.status = "AVAILABLE"
                s.last_status_change = now_utc

    loc.updated_at = now_utc
    db.commit()
    db.refresh(loc)

    available_count = sum(1 for s in loc.spots if s.status.upper() == "AVAILABLE")
    loc_status = "AVAILABLE" if available_count > 0 else "OCCUPIED"

    event_data = {
        "event": "SPOT_STATUS_CHANGED",
        "spot_id": loc.id,
        "name": loc.name,
        "status": loc_status,
        "available_spots": available_count,
        "timestamp": now_utc.isoformat(),
    }
    manager.record_event(event_data)
    await manager.broadcast(event_data)

    return SpotStatusResponse(
        spot_id=loc.id,
        status=loc_status,
        available_spots=available_count,
        updated_at=loc.updated_at,
    )


@router.post("", response_model=ParkingLocationDetail, status_code=status.HTTP_201_CREATED)
def create_parking_location(
    payload: ParkingLocationCreate,
    db: Session = Depends(get_db),
):
    now_utc = datetime.now(timezone.utc)
    loc_id = str(uuid.uuid4())

    loc = ParkingLocation(
        id=loc_id,
        name=payload.name,
        address=payload.address,
        latitude=payload.latitude,
        longitude=payload.longitude,
        spot_type=payload.spot_type,
        has_ev_charging=payload.has_ev_charging,
        total_capacity=payload.total_capacity,
        created_at=now_utc,
        updated_at=now_utc,
    )
    db.add(loc)

    rate = HourlyRate(
        id=str(uuid.uuid4()),
        location_id=loc_id,
        base_rate_per_hour=payload.base_rate_per_hour,
        peak_rate_per_hour=payload.peak_rate_per_hour,
        weekend_rate_per_hour=payload.weekend_rate_per_hour,
        max_daily_rate=payload.max_daily_rate,
        currency="USD",
        created_at=now_utc,
        updated_at=now_utc,
    )
    db.add(rate)

    for i in range(1, payload.total_capacity + 1):
        spot = ParkingSpot(
            id=str(uuid.uuid4()),
            location_id=loc_id,
            spot_number=f"P-{i:02d}",
            status="AVAILABLE",
            last_status_change=now_utc,
        )
        db.add(spot)

    db.commit()
    db.refresh(loc)

    active_rate, is_peak = evaluate_spot_rate(loc.rates, now_utc)
    rates_dict = get_rate_breakdown_dict(loc, loc.rates, now_utc)

    return ParkingLocationDetail(
        id=loc.id,
        spot_id=loc.id,
        name=loc.name,
        address=loc.address,
        latitude=loc.latitude,
        longitude=loc.longitude,
        spot_type=loc.spot_type,
        has_ev_charging=loc.has_ev_charging,
        total_capacity=loc.total_capacity,
        available_spots=loc.total_capacity,
        status="AVAILABLE",
        hourly_rate=active_rate,
        base_hourly_rate=payload.base_rate_per_hour,
        current_active_rate=active_rate,
        is_peak=is_peak,
        is_peak_hours=is_peak,
        currency="USD",
        rates=RateBreakdownResponse(**rates_dict),
        spots=loc.spots,
        created_at=loc.created_at,
        updated_at=loc.updated_at,
    )
