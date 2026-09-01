import math
from datetime import datetime, time
from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from server.models.parking import ParkingLocation, ParkingSpot, HourlyRate, SensorEvent
from server.schemas.parking import (
    ParkingLocationCreate,
    ParkingSpotResponse,
    HourlyRateResponse,
    CostCalculationResponse,
    SpotStatusUpdateResponse,
    SensorEventResponse,
)


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points in kilometers."""
    R = 6371.0  # Earth's radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 3)


def is_peak_hour(rate: Optional[HourlyRate], dt: Optional[datetime] = None) -> bool:
    """Check if the given datetime is within peak hours."""
    current_dt = dt or datetime.utcnow()
    # Check weekday (Monday=0 ... Friday=4)
    is_weekday = current_dt.weekday() < 5
    if not is_weekday:
        return False

    current_time = current_dt.time()
    start_time = (
        rate.peak_start_time if rate and rate.peak_start_time else time(7, 0, 0)
    )
    end_time = rate.peak_end_time if rate and rate.peak_end_time else time(19, 0, 0)

    if start_time <= end_time:
        return start_time <= current_time <= end_time
    else:
        # Crosses midnight
        return current_time >= start_time or current_time <= end_time


def search_parking_spots(
    db: Session,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    address: Optional[str] = None,
    radius_km: float = 10.0,
    max_rate: Optional[float] = None,
    spot_type: Optional[str] = None,
    has_ev_charging: Optional[bool] = None,
    sort_by: str = "distance",
    skip: int = 0,
    limit: int = 50,
) -> Tuple[int, List[ParkingSpotResponse]]:
    """Search and filter parking locations based on coordinates or address, filters and sort preferences."""
    locations = db.query(ParkingLocation).all()
    if not locations:
        return 0, []

    # Determine reference coordinates
    if lat is not None and lng is not None:
        ref_lat, ref_lng = float(lat), float(lng)
    elif address and address.strip():
        # Match address or default to SF downtown
        search_term = address.strip().lower()
        matched = None
        for loc in locations:
            if search_term in loc.address.lower() or search_term in loc.name.lower():
                matched = loc
                break
        if matched:
            ref_lat, ref_lng = matched.latitude, matched.longitude
        else:
            ref_lat, ref_lng = 37.7749, -122.4194
    else:
        ref_lat, ref_lng = 37.7749, -122.4194

    filtered_spots = []

    for loc in locations:
        dist = haversine_distance(ref_lat, ref_lng, loc.latitude, loc.longitude)

        # Radius filter
        if radius_km is not None and dist > float(radius_km):
            continue

        rate = loc.rates
        base_rate = float(rate.base_rate_per_hour) if rate else 5.0
        peak_rate = float(rate.peak_rate_per_hour) if rate else 8.0
        max_daily = float(rate.max_daily_rate) if rate and rate.max_daily_rate else 35.0

        is_peak = is_peak_hour(rate)
        current_rate = peak_rate if is_peak else base_rate

        # Price filter
        if (
            max_rate is not None
            and current_rate > float(max_rate)
            and base_rate > float(max_rate)
        ):
            continue

        # Spot type filter
        if spot_type and spot_type.strip() and spot_type.lower() != "all":
            if loc.spot_type.lower() != spot_type.strip().lower():
                continue

        # EV charging filter
        if has_ev_charging is not None and loc.has_ev_charging != has_ev_charging:
            continue

        status_str = "AVAILABLE" if loc.available_spots > 0 else "OCCUPIED"

        spot_response = ParkingSpotResponse(
            spot_id=loc.id,
            id=loc.id,
            name=loc.name,
            address=loc.address,
            latitude=loc.latitude,
            longitude=loc.longitude,
            distance_km=dist,
            hourly_rate=current_rate,
            currency="USD",
            status=status_str,
            total_capacity=loc.total_capacity,
            available_spots=loc.available_spots,
            spot_type=loc.spot_type,
            has_ev_charging=loc.has_ev_charging,
            is_peak_hours=is_peak,
            base_hourly_rate=base_rate,
            peak_rate_per_hour=peak_rate,
            max_daily_cap=max_daily,
            created_at=loc.created_at,
            updated_at=loc.updated_at,
        )
        filtered_spots.append(spot_response)

    # Sorting
    if sort_by == "price" or sort_by == "rate":
        filtered_spots.sort(key=lambda s: s.hourly_rate)
    elif sort_by == "availability":
        filtered_spots.sort(key=lambda s: s.available_spots, reverse=True)
    else:  # default "distance"
        filtered_spots.sort(
            key=lambda s: s.distance_km if s.distance_km is not None else 999999
        )

    total = len(filtered_spots)
    paginated = filtered_spots[skip : skip + limit]
    return total, paginated


def get_spot_details(db: Session, spot_id: str) -> Optional[ParkingSpotResponse]:
    """Retrieve detailed information for a specific parking location/spot."""
    loc = db.query(ParkingLocation).filter(ParkingLocation.id == spot_id).first()
    if not loc:
        # Check by individual spot
        spot = db.query(ParkingSpot).filter(ParkingSpot.id == spot_id).first()
        if spot and spot.location:
            loc = spot.location
        else:
            return None

    rate = loc.rates
    base_rate = float(rate.base_rate_per_hour) if rate else 5.0
    peak_rate = float(rate.peak_rate_per_hour) if rate else 8.0
    max_daily = float(rate.max_daily_rate) if rate and rate.max_daily_rate else 35.0
    is_peak = is_peak_hour(rate)
    current_rate = peak_rate if is_peak else base_rate
    status_str = "AVAILABLE" if loc.available_spots > 0 else "OCCUPIED"

    return ParkingSpotResponse(
        spot_id=loc.id,
        id=loc.id,
        name=loc.name,
        address=loc.address,
        latitude=loc.latitude,
        longitude=loc.longitude,
        distance_km=0.0,
        hourly_rate=current_rate,
        currency="USD",
        status=status_str,
        total_capacity=loc.total_capacity,
        available_spots=loc.available_spots,
        spot_type=loc.spot_type,
        has_ev_charging=loc.has_ev_charging,
        is_peak_hours=is_peak,
        base_hourly_rate=base_rate,
        peak_rate_per_hour=peak_rate,
        max_daily_cap=max_daily,
        created_at=loc.created_at,
        updated_at=loc.updated_at,
    )


def get_spot_rates(
    db: Session, spot_id: str, target_date: Optional[str] = None
) -> Optional[HourlyRateResponse]:
    """Get the rate breakdown and active rate for a parking location."""
    loc = db.query(ParkingLocation).filter(ParkingLocation.id == spot_id).first()
    if not loc:
        spot = db.query(ParkingSpot).filter(ParkingSpot.id == spot_id).first()
        if spot and spot.location:
            loc = spot.location
        else:
            return None

    rate = loc.rates
    base_rate = float(rate.base_rate_per_hour) if rate else 5.0
    peak_rate = float(rate.peak_rate_per_hour) if rate else 8.0
    max_daily = float(rate.max_daily_rate) if rate and rate.max_daily_rate else 35.0

    eval_dt = None
    if target_date:
        try:
            eval_dt = datetime.fromisoformat(target_date.replace("Z", "+00:00"))
        except Exception:
            eval_dt = None

    is_peak = is_peak_hour(rate, eval_dt)
    current_active_rate = peak_rate if is_peak else base_rate

    breakdown = {
        "standard_rate": f"${base_rate:.2f}/hr (Off-Peak: 7:00 PM - 7:00 AM)",
        "peak_rate": f"${peak_rate:.2f}/hr (Peak: 7:00 AM - 7:00 PM)",
        "weekend_rate": f"${(base_rate * 1.2):.2f}/hr",
    }

    return HourlyRateResponse(
        spot_id=loc.id,
        base_hourly_rate=base_rate,
        currency="USD",
        rate_breakdown=breakdown,
        current_active_rate=current_active_rate,
        is_peak=is_peak,
        max_daily_cap=max_daily,
    )


def calculate_cost(
    db: Session, spot_id: str, hours: float, start_time: Optional[str] = None
) -> Optional[CostCalculationResponse]:
    """Estimate total parking cost based on hours, time of arrival, and daily cap."""
    loc = db.query(ParkingLocation).filter(ParkingLocation.id == spot_id).first()
    if not loc:
        spot = db.query(ParkingSpot).filter(ParkingSpot.id == spot_id).first()
        if spot and spot.location:
            loc = spot.location
        else:
            return None

    rate = loc.rates
    base_rate = float(rate.base_rate_per_hour) if rate else 5.0
    peak_rate = float(rate.peak_rate_per_hour) if rate else 8.0
    max_daily = float(rate.max_daily_rate) if rate and rate.max_daily_rate else 35.0

    applied_rate = base_rate
    if start_time:
        try:
            parts = start_time.split(":")
            h, m = int(parts[0]), int(parts[1]) if len(parts) > 1 else 0
            if 7 <= h < 19:
                applied_rate = peak_rate
        except Exception:
            applied_rate = base_rate
    else:
        if is_peak_hour(rate):
            applied_rate = peak_rate

    raw_cost = round(hours * applied_rate, 2)
    capped = False
    if max_daily and raw_cost > max_daily:
        num_days = max(1, math.ceil(hours / 24.0))
        estimated_cost = min(raw_cost, max_daily * num_days)
        capped = True
    else:
        estimated_cost = raw_cost

    return CostCalculationResponse(
        spot_id=loc.id,
        hours=hours,
        estimated_cost=estimated_cost,
        applied_rate_per_hour=applied_rate,
        capped_at_daily_max=capped,
        currency="USD",
    )


def update_spot_status(
    db: Session,
    spot_id: str,
    status: Optional[str] = None,
    available_spots: Optional[int] = None,
) -> Optional[Tuple[SpotStatusUpdateResponse, Dict[str, Any]]]:
    """Update parking spot availability and record a telemetry event."""
    loc = db.query(ParkingLocation).filter(ParkingLocation.id == spot_id).first()
    if not loc:
        spot = db.query(ParkingSpot).filter(ParkingSpot.id == spot_id).first()
        if spot and spot.location:
            loc = spot.location
        else:
            return None

    if available_spots is not None:
        loc.available_spots = max(0, min(loc.total_capacity, int(available_spots)))
        new_status = "AVAILABLE" if loc.available_spots > 0 else "OCCUPIED"
    elif status is not None:
        new_status = status.upper()
        if new_status == "OCCUPIED":
            loc.available_spots = 0
        elif new_status == "AVAILABLE" and loc.available_spots == 0:
            loc.available_spots = max(1, loc.total_capacity // 4)
    else:
        new_status = "AVAILABLE" if loc.available_spots > 0 else "OCCUPIED"

    loc.updated_at = datetime.utcnow()

    # Record Sensor Event
    event = SensorEvent(
        spot_id=loc.id,
        facility_name=loc.name,
        status=new_status,
        available_spots=loc.available_spots,
        event_type="SPOT_STATUS_CHANGED",
        timestamp=loc.updated_at,
    )
    db.add(event)
    db.commit()
    db.refresh(loc)

    update_resp = SpotStatusUpdateResponse(
        spot_id=loc.id,
        status=new_status,
        available_spots=loc.available_spots,
        updated_at=loc.updated_at,
    )

    broadcast_payload = {
        "event": "SPOT_STATUS_CHANGED",
        "spot_id": loc.id,
        "name": loc.name,
        "status": new_status,
        "available_spots": loc.available_spots,
        "timestamp": loc.updated_at.isoformat() + "Z",
    }

    return update_resp, broadcast_payload


def get_recent_events(db: Session, limit: int = 20) -> List[SensorEventResponse]:
    """Retrieve recent sensor transition events."""
    events = (
        db.query(SensorEvent).order_by(SensorEvent.timestamp.desc()).limit(limit).all()
    )
    return [
        SensorEventResponse(
            event=evt.event_type,
            spot_id=evt.spot_id,
            name=evt.facility_name,
            status=evt.status,
            available_spots=evt.available_spots,
            timestamp=evt.timestamp,
        )
        for evt in events
    ]


def create_parking_location(
    db: Session, data: ParkingLocationCreate
) -> ParkingSpotResponse:
    """Create a new parking location."""
    avail = (
        data.available_spots
        if data.available_spots is not None
        else data.total_capacity
    )
    loc = ParkingLocation(
        name=data.name,
        address=data.address,
        latitude=data.latitude,
        longitude=data.longitude,
        spot_type=data.spot_type,
        has_ev_charging=data.has_ev_charging,
        total_capacity=data.total_capacity,
        available_spots=avail,
    )
    db.add(loc)
    db.flush()

    rate = HourlyRate(
        location_id=loc.id,
        base_rate_per_hour=data.base_rate_per_hour,
        peak_rate_per_hour=data.peak_rate_per_hour,
        peak_start_time=time(7, 0, 0),
        peak_end_time=time(19, 0, 0),
        max_daily_rate=data.max_daily_rate,
    )
    db.add(rate)
    db.commit()
    db.refresh(loc)

    return get_spot_details(db, loc.id)
