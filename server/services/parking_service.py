import math
from datetime import datetime, timezone, time
from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from server.models.parking import ParkingLocation, ParkingSpot, HourlyRate


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points on the Earth in kilometers."""
    r = 6371.0  # Earth's radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r * c, 2)


def is_peak_time(
    dt: Optional[datetime] = None,
    peak_start: str = "07:00:00",
    peak_end: str = "19:00:00",
) -> Tuple[bool, bool]:
    """
    Returns (is_peak, is_weekend).
    Peak hours apply on weekdays (Monday-Friday) between peak_start and peak_end.
    """
    if dt is None:
        dt = datetime.now(timezone.utc)

    # Check weekend (5 = Saturday, 6 = Sunday)
    is_weekend = dt.weekday() >= 5
    if is_weekend:
        return False, True

    try:
        t = dt.time()
        start_parts = [int(p) for p in str(peak_start).split(":")]
        end_parts = [int(p) for p in str(peak_end).split(":")]
        start_t = time(
            start_parts[0],
            start_parts[1],
            start_parts[2] if len(start_parts) > 2 else 0,
        )
        end_t = time(
            end_parts[0], end_parts[1], end_parts[2] if len(end_parts) > 2 else 0
        )

        if start_t <= end_t:
            is_peak = start_t <= t <= end_t
        else:
            is_peak = t >= start_t or t <= end_t
    except Exception:
        is_peak = 7 <= dt.hour < 19

    return is_peak, False


def resolve_active_rate(
    rate: Optional[HourlyRate], dt: Optional[datetime] = None
) -> Tuple[float, bool]:
    """Returns (active_rate_per_hour, is_peak)."""
    if not rate:
        return 5.0, False

    is_peak, is_weekend = is_peak_time(
        dt,
        peak_start=str(rate.peak_start_time),
        peak_end=str(rate.peak_end_time),
    )

    if is_weekend:
        return float(rate.weekend_rate_per_hour or rate.base_rate_per_hour), False
    elif is_peak:
        return float(rate.peak_rate_per_hour or rate.base_rate_per_hour), True
    else:
        return float(rate.base_rate_per_hour), False


def format_rate_breakdown(rate: Optional[HourlyRate]) -> Dict[str, str]:
    if not rate:
        return {
            "standard_rate": "$5.00/hr (Off-Peak: 7:00 PM - 7:00 AM)",
            "peak_rate": "$8.00/hr (Peak: 7:00 AM - 7:00 PM)",
            "weekend_rate": "$6.00/hr",
        }

    base = float(rate.base_rate_per_hour)
    peak = float(rate.peak_rate_per_hour)
    weekend = float(rate.weekend_rate_per_hour) if rate.weekend_rate_per_hour else base

    return {
        "standard_rate": f"${base:.2f}/hr (Off-Peak: 7:00 PM - 7:00 AM)",
        "peak_rate": f"${peak:.2f}/hr (Peak: 7:00 AM - 7:00 PM)",
        "weekend_rate": f"${weekend:.2f}/hr",
    }


def search_parking_locations(
    db: Session,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    address: Optional[str] = None,
    radius_km: float = 5.0,
    max_rate: Optional[float] = None,
    spot_type: Optional[str] = None,
    has_ev_charging: Optional[bool] = None,
    status: Optional[str] = None,
    sort_by: Optional[str] = "distance",
) -> List[Dict[str, Any]]:
    # Geocode address fallback if lat/lng not provided
    if (lat is None or lng is None) and address:
        addr_lower = address.lower()
        if "market" in addr_lower or "embarcadero" in addr_lower:
            lat, lng = 37.7941, -122.3952
        elif "valencia" in addr_lower or "mission" in addr_lower:
            lat, lng = 37.7600, -122.4215
        elif "mcallister" in addr_lower or "civic" in addr_lower:
            lat, lng = 37.7808, -122.4172
        elif "union" in addr_lower or "post" in addr_lower:
            lat, lng = 37.7880, -122.4075
        elif "soma" in addr_lower or "howard" in addr_lower:
            lat, lng = 37.7878, -122.3970
        else:
            # Default to Downtown San Francisco center
            lat, lng = 37.7749, -122.4194
    elif lat is None or lng is None:
        lat, lng = 37.7749, -122.4194

    query = db.query(ParkingLocation)

    if spot_type:
        query = query.filter(ParkingLocation.spot_type == spot_type.lower())

    if has_ev_charging is not None:
        query = query.filter(ParkingLocation.has_ev_charging == has_ev_charging)

    all_locations = query.all()
    now_utc = datetime.now(timezone.utc)
    results: List[Dict[str, Any]] = []

    for loc in all_locations:
        loc_lat = float(loc.latitude)
        loc_lng = float(loc.longitude)
        dist = haversine_distance(lat, lng, loc_lat, loc_lng)

        # Distance filter
        if radius_km is not None and radius_km > 0 and dist > radius_km:
            continue

        active_rate, is_peak = resolve_active_rate(loc.rates, now_utc)

        # Max rate filter
        if max_rate is not None and active_rate > max_rate:
            continue

        avail_spots = int(loc.available_spots)
        computed_status = "AVAILABLE" if avail_spots > 0 else "OCCUPIED"

        # Status filter
        if status and computed_status.upper() != status.upper():
            continue

        item: Dict[str, Any] = {
            "spot_id": str(loc.id),
            "location_id": str(loc.id),
            "name": str(loc.name),
            "address": str(loc.address),
            "latitude": loc_lat,
            "longitude": loc_lng,
            "distance_km": dist,
            "hourly_rate": float(active_rate),
            "currency": "USD",
            "status": computed_status,
            "total_capacity": int(loc.total_capacity),
            "available_spots": avail_spots,
            "spot_type": str(loc.spot_type),
            "has_ev_charging": bool(loc.has_ev_charging),
            "is_peak_hours": is_peak,
            "updated_at": loc.updated_at.isoformat()
            if loc.updated_at
            else now_utc.isoformat(),
        }
        results.append(item)

    # Sort results
    if sort_by == "price" or sort_by == "rate":
        results.sort(key=lambda x: (x["hourly_rate"], x["distance_km"]))
    elif sort_by == "name":
        results.sort(key=lambda x: str(x["name"]))
    elif sort_by == "capacity":
        results.sort(key=lambda x: -int(x["available_spots"]))
    else:  # default "distance"
        results.sort(key=lambda x: (x["distance_km"], x["hourly_rate"]))

    return results


def get_location_by_id(
    db: Session, location_or_spot_id: str
) -> Optional[ParkingLocation]:
    loc = (
        db.query(ParkingLocation)
        .filter(ParkingLocation.id == location_or_spot_id)
        .first()
    )
    if loc:
        return loc

    # Check if it was an individual spot ID
    spot = db.query(ParkingSpot).filter(ParkingSpot.id == location_or_spot_id).first()
    if spot:
        return spot.location
    return None


def get_rates_for_location(
    db: Session,
    location_or_spot_id: str,
    target_date: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    loc = get_location_by_id(db, location_or_spot_id)
    if not loc:
        return None

    rate = loc.rates
    dt = None
    if target_date:
        try:
            dt = datetime.fromisoformat(target_date.replace("Z", "+00:00"))
        except Exception:
            dt = datetime.now(timezone.utc)
    else:
        dt = datetime.now(timezone.utc)

    active_rate, is_peak = resolve_active_rate(rate, dt)
    base_rate = float(rate.base_rate_per_hour) if rate else 5.0
    max_daily = float(rate.max_daily_rate) if rate else 35.0

    return {
        "spot_id": str(loc.id),
        "base_hourly_rate": base_rate,
        "currency": "USD",
        "rate_breakdown": format_rate_breakdown(rate),
        "current_active_rate": float(active_rate),
        "is_peak": bool(is_peak),
        "max_daily_cap": max_daily,
    }


def calculate_cost(
    db: Session,
    location_or_spot_id: str,
    hours: float,
    start_time: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    loc = get_location_by_id(db, location_or_spot_id)
    if not loc:
        return None

    rate = loc.rates
    dt = None
    if start_time:
        try:
            dt = datetime.fromisoformat(start_time.replace("Z", "+00:00"))
        except Exception:
            dt = datetime.now(timezone.utc)
    else:
        dt = datetime.now(timezone.utc)

    active_rate, is_peak = resolve_active_rate(rate, dt)
    max_daily = float(rate.max_daily_rate) if (rate and rate.max_daily_rate) else 35.0

    # Calculate raw cost
    raw_cost = round(hours * active_rate, 2)
    capped = False
    if hours >= 24:
        days = math.ceil(hours / 24.0)
        estimated_cost = min(raw_cost, days * max_daily)
        capped = estimated_cost < raw_cost
    else:
        if raw_cost > max_daily:
            estimated_cost = max_daily
            capped = True
        else:
            estimated_cost = raw_cost

    return {
        "spot_id": str(loc.id),
        "name": str(loc.name),
        "requested_hours": hours,
        "estimated_cost": estimated_cost,
        "currency": "USD",
        "capped_at_daily_max": capped,
        "applied_rate_per_hour": float(active_rate),
        "is_peak": bool(is_peak),
    }


def update_spot_or_location_status(
    db: Session,
    spot_or_location_id: str,
    status: Optional[str] = None,
    available_spots: Optional[int] = None,
) -> Optional[Dict[str, Any]]:
    loc = (
        db.query(ParkingLocation)
        .filter(ParkingLocation.id == spot_or_location_id)
        .first()
    )
    spot = None

    if not loc:
        spot = (
            db.query(ParkingSpot).filter(ParkingSpot.id == spot_or_location_id).first()
        )
        if spot:
            loc = spot.location

    if not loc:
        return None

    now = datetime.now(timezone.utc)

    if spot and status:
        spot.status = status.upper()  # type: ignore[assignment]
        spot.last_status_change = now  # type: ignore[assignment]

        # Recalculate available spots for location
        open_count = (
            db.query(ParkingSpot)
            .filter(
                ParkingSpot.location_id == loc.id, ParkingSpot.status == "AVAILABLE"
            )
            .count()
        )
        loc.available_spots = open_count  # type: ignore[assignment]

    if available_spots is not None:
        loc.available_spots = max(0, min(available_spots, int(loc.total_capacity)))  # type: ignore[assignment]

    if status and not spot:
        if status.upper() == "OCCUPIED":
            loc.available_spots = 0  # type: ignore[assignment]
        elif status.upper() == "AVAILABLE" and int(loc.available_spots) == 0:
            loc.available_spots = max(1, int(int(loc.total_capacity) * 0.2))  # type: ignore[assignment]

    loc.updated_at = now  # type: ignore[assignment]
    db.commit()
    db.refresh(loc)

    avail_count = int(loc.available_spots)
    final_status = "AVAILABLE" if avail_count > 0 else "OCCUPIED"

    return {
        "spot_id": str(loc.id),
        "name": str(loc.name),
        "status": final_status,
        "available_spots": avail_count,
        "total_capacity": int(loc.total_capacity),
        "timestamp": now.isoformat(),
    }
