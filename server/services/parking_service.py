import math
from datetime import datetime, time, timezone
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy.orm import Session
from server.models.parking import HourlyRate, ParkingLocation, ParkingSpot
from server.services.realtime_service import manager


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two coordinates in kilometers using Haversine formula."""
    r = 6371.0  # Earth's radius in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r * c, 2)


def geocode_address(address: str) -> Tuple[float, float]:
    """Resolve address to latitude and longitude with fallback mapping."""
    clean_addr = (address or "").lower()
    if "market" in clean_addr:
        return 37.7910, -122.4010
    if "mission" in clean_addr:
        return 37.7840, -122.4070
    if "folsom" in clean_addr:
        return 37.7880, -122.3950
    if "post" in clean_addr or "union" in clean_addr:
        return 37.7885, -122.4075
    # Default San Francisco City Center coordinate
    return 37.7749, -122.4194


def is_time_between(check_time: time, start_time: time, end_time: time) -> bool:
    """Check if a given time is between start_time and end_time."""
    if start_time <= end_time:
        return start_time <= check_time <= end_time
    else:  # Over midnight
        return check_time >= start_time or check_time <= end_time


def evaluate_spot_rate(rate: Optional[HourlyRate], dt: Optional[datetime] = None) -> Tuple[float, bool]:
    """Determine the active rate per hour and whether peak pricing applies."""
    if not rate:
        return 5.00, False

    target_dt = dt or datetime.now(timezone.utc)
    weekday = target_dt.weekday()  # 0: Monday, 6: Sunday
    current_time = target_dt.time()

    base_rate = float(rate.base_rate_per_hour)
    peak_rate = float(rate.peak_rate_per_hour)
    weekend_rate = float(rate.weekend_rate_per_hour) if rate.weekend_rate_per_hour is not None else base_rate

    # Weekend check (Saturday = 5, Sunday = 6)
    if weekday in (5, 6):
        return weekend_rate, False

    # Peak hours check on weekdays
    try:
        start_t = datetime.strptime(rate.peak_start_time or "07:00:00", "%H:%M:%S").time()
        end_t = datetime.strptime(rate.peak_end_time or "19:00:00", "%H:%M:%S").time()
        if is_time_between(current_time, start_t, end_t):
            return peak_rate, True
    except Exception:
        pass

    return base_rate, False


def get_rate_breakdown_dict(location: ParkingLocation, rate: Optional[HourlyRate], dt: Optional[datetime] = None) -> Dict[str, Any]:
    base_rate = float(rate.base_rate_per_hour) if rate else 5.00
    peak_rate = float(rate.peak_rate_per_hour) if rate else 8.00
    weekend_rate = float(rate.weekend_rate_per_hour) if rate and rate.weekend_rate_per_hour is not None else base_rate
    max_daily = float(rate.max_daily_rate) if rate and rate.max_daily_rate is not None else 35.00
    currency = rate.currency if rate else "USD"

    active_rate, is_peak = evaluate_spot_rate(rate, dt)

    start_str = rate.peak_start_time if rate and rate.peak_start_time else "07:00:00"
    end_str = rate.peak_end_time if rate and rate.peak_end_time else "19:00:00"

    breakdown = {
        "standard_rate": f"${base_rate:.2f}/hr (Off-Peak: {end_str} - {start_str})",
        "peak_rate": f"${peak_rate:.2f}/hr (Peak: {start_str} - {end_str})",
        "weekend_rate": f"${weekend_rate:.2f}/hr",
    }

    return {
        "spot_id": location.id,
        "base_hourly_rate": base_rate,
        "currency": currency,
        "rate_breakdown": breakdown,
        "current_active_rate": active_rate,
        "is_peak": is_peak,
        "max_daily_cap": max_daily,
    }


def search_parking_locations(
    db: Session,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    address: Optional[str] = None,
    radius_km: Optional[float] = None,
    max_rate: Optional[float] = None,
    spot_type: Optional[str] = None,
    has_ev_charging: Optional[bool] = None,
    status_filter: Optional[str] = None,
    sort_by: Optional[str] = "distance",
    skip: int = 0,
    limit: int = 50,
) -> Tuple[List[Dict[str, Any]], int]:
    # Determine center coordinate
    if lat is None or lng is None:
        center_lat, center_lng = geocode_address(address or "")
    else:
        center_lat, center_lng = lat, lng

    query = db.query(ParkingLocation)

    if spot_type:
        query = query.filter(ParkingLocation.spot_type == spot_type)
    if has_ev_charging is not None:
        query = query.filter(ParkingLocation.has_ev_charging == has_ev_charging)

    locations = query.order_by(ParkingLocation.created_at.asc()).all()

    now_utc = datetime.now(timezone.utc)
    results = []

    for loc in locations:
        dist = haversine_distance(center_lat, center_lng, loc.latitude, loc.longitude)

        # Radius filter
        if radius_km is not None and dist > radius_km:
            continue

        active_rate, is_peak = evaluate_spot_rate(loc.rates, now_utc)

        # Max rate filter
        if max_rate is not None and active_rate > max_rate:
            continue

        available_count = sum(1 for s in loc.spots if s.status.upper() == "AVAILABLE")
        loc_status = "AVAILABLE" if available_count > 0 else "OCCUPIED"

        if status_filter and loc_status.upper() != status_filter.upper():
            continue

        base_rate = float(loc.rates.base_rate_per_hour) if loc.rates else 5.00

        item = {
            "spot_id": loc.id,
            "id": loc.id,
            "name": loc.name,
            "address": loc.address,
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "distance_km": dist,
            "hourly_rate": active_rate,
            "base_hourly_rate": base_rate,
            "current_active_rate": active_rate,
            "currency": loc.rates.currency if loc.rates else "USD",
            "status": loc_status,
            "total_capacity": loc.total_capacity,
            "available_spots": available_count,
            "spot_type": loc.spot_type,
            "has_ev_charging": loc.has_ev_charging,
            "is_peak_hours": is_peak,
            "is_peak": is_peak,
            "updated_at": loc.updated_at,
        }
        results.append(item)

    # Sorting
    if sort_by == "price" or sort_by == "rate":
        results.sort(key=lambda x: x["hourly_rate"])
    elif sort_by == "available_spots":
        results.sort(key=lambda x: x["available_spots"], reverse=True)
    elif sort_by == "capacity":
        results.sort(key=lambda x: x["total_capacity"], reverse=True)
    else:  # default distance
        results.sort(key=lambda x: x["distance_km"])

    total = len(results)
    paged = results[skip : skip + limit]
    return paged, total
