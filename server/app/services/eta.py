"""
Module: services.eta
Purpose: Haversine distance and live Estimated Arrival Time (ETA) calculation logic
"""

import math
from datetime import datetime, timezone
from typing import Dict, Any, Optional


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points
    on the earth (specified in decimal degrees) in miles.
    """
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1) * math.sin(lat2) * math.cos(dlon / 2) ** 2
    )
    c = 2 * math.asin(math.sqrt(a))
    r = 3956
    return c * r


def calculate_bus_stop_eta(
    bus_lat: float,
    bus_lon: float,
    bus_speed_mph: float,
    stop_lat: float,
    stop_lon: float,
    last_telemetry_at: Optional[datetime] = None,
) -> Dict[str, Any]:
    """
    Calculate ETA in minutes and distance in miles for a bus approaching a stop.
    Includes stale/offline status detection (>30s telemetry gap).
    """
    distance_miles = haversine_distance(bus_lat, bus_lon, stop_lat, stop_lon)

    is_offline = False
    if last_telemetry_at:
        if last_telemetry_at.tzinfo is None:
            now = datetime.utcnow()
        else:
            now = datetime.now(timezone.utc)
        elapsed_seconds = (now - last_telemetry_at).total_seconds()
        if elapsed_seconds > 30:
            is_offline = True

    effective_speed = bus_speed_mph if bus_speed_mph and bus_speed_mph > 0 else 15.0
    time_hours = distance_miles / effective_speed
    eta_minutes = max(1, round(time_hours * 60))

    delay_status = "On Time"
    if is_offline:
        delay_status = "Offline/Stale"
    elif effective_speed < 5.0 and distance_miles > 0.1:
        delay_status = "Delayed (Heavy Traffic)"

    return {
        "distance_miles": round(distance_miles, 2),
        "eta_minutes": eta_minutes,
        "speed_mph": bus_speed_mph,
        "is_offline": is_offline,
        "delay_status": delay_status,
    }
