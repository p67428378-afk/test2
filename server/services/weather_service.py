from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

from server.models.location import CachedLocation
from server.models.search_history import SearchHistory
from server.schemas.weather import (
    LocationSchema,
    CurrentWeatherDetail,
    CurrentWeatherResponse,
    DailyForecastItem,
    ForecastResponse,
    TrendPoint,
    TrendSummary,
    TrendsResponse,
    SearchResultItem,
)
from server.services.cache_service import cache_service

DEFAULT_LOCATION = {
    "name": "New York",
    "region": "New York",
    "country": "United States",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "zip_code": "10001",
}

KNOWN_LOCATIONS = [
    {
        "id": "loc-ny-001",
        "name": "New York",
        "region": "New York",
        "country": "United States",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "zip_code": "10001",
    },
    {
        "id": "loc-lon-002",
        "name": "London",
        "region": "England",
        "country": "United Kingdom",
        "latitude": 51.5074,
        "longitude": -0.1278,
        "zip_code": "EC1A",
    },
    {
        "id": "loc-tok-003",
        "name": "Tokyo",
        "region": "Tokyo",
        "country": "Japan",
        "latitude": 35.6762,
        "longitude": 139.6503,
        "zip_code": "100-0001",
    },
    {
        "id": "loc-sf-004",
        "name": "San Francisco",
        "region": "California",
        "country": "United States",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "zip_code": "94102",
    },
    {
        "id": "loc-chi-005",
        "name": "Chicago",
        "region": "Illinois",
        "country": "United States",
        "latitude": 41.8781,
        "longitude": -87.6298,
        "zip_code": "60601",
    },
    {
        "id": "loc-par-006",
        "name": "Paris",
        "region": "Ile-de-France",
        "country": "France",
        "latitude": 48.8566,
        "longitude": 2.3522,
        "zip_code": "75001",
    },
    {
        "id": "loc-la-007",
        "name": "Los Angeles",
        "region": "California",
        "country": "United States",
        "latitude": 34.0522,
        "longitude": -118.2437,
        "zip_code": "90001",
    },
    {
        "id": "loc-sea-008",
        "name": "Seattle",
        "region": "Washington",
        "country": "United States",
        "latitude": 47.6062,
        "longitude": -122.3321,
        "zip_code": "98101",
    },
    {
        "id": "loc-mia-009",
        "name": "Miami",
        "region": "Florida",
        "country": "United States",
        "latitude": 25.7617,
        "longitude": -80.1918,
        "zip_code": "33101",
    },
    {
        "id": "loc-aus-010",
        "name": "Austin",
        "region": "Texas",
        "country": "United States",
        "latitude": 30.2672,
        "longitude": -97.7431,
        "zip_code": "78701",
    },
]


def fahrenheit_to_celsius(f_temp: float) -> float:
    return round((f_temp - 32.0) * 5.0 / 9.0, 1)


def celsius_to_fahrenheit(c_temp: float) -> float:
    return round((c_temp * 9.0 / 5.0) + 32.0, 1)


def convert_temp(f_temp: float, target_unit: str) -> float:
    if target_unit.lower() == "celsius":
        return fahrenheit_to_celsius(f_temp)
    return round(f_temp, 1)


class WeatherService:
    @staticmethod
    def resolve_location(
        db: Optional[Session] = None,
        location_query: Optional[str] = None,
        lat: Optional[float] = None,
        lon: Optional[float] = None,
    ) -> Dict[str, Any]:
        """Resolve query or coordinates to a location dictionary."""
        if lat is not None and lon is not None:
            # Check if coordinates match a known location closely
            if db:
                loc_db = (
                    db.query(CachedLocation)
                    .filter(
                        CachedLocation.latitude.between(lat - 0.1, lat + 0.1),
                        CachedLocation.longitude.between(lon - 0.1, lon + 0.1),
                    )
                    .first()
                )
                if loc_db:
                    return {
                        "name": loc_db.name,
                        "region": loc_db.region,
                        "country": loc_db.country,
                        "latitude": loc_db.latitude,
                        "longitude": loc_db.longitude,
                    }
            return {
                "name": f"Location ({lat:.2f}, {lon:.2f})",
                "region": None,
                "country": "Custom",
                "latitude": lat,
                "longitude": lon,
            }

        if location_query:
            query_clean = location_query.strip().lower()
            # 1. Search database
            if db:
                loc_db = (
                    db.query(CachedLocation)
                    .filter(
                        (CachedLocation.name.ilike(f"%{query_clean}%"))
                        | (CachedLocation.zip_code.ilike(f"%{query_clean}%"))
                    )
                    .first()
                )
                if loc_db:
                    return {
                        "name": loc_db.name,
                        "region": loc_db.region,
                        "country": loc_db.country,
                        "latitude": loc_db.latitude,
                        "longitude": loc_db.longitude,
                    }

            # 2. Search known locations list
            for loc in KNOWN_LOCATIONS:
                if (
                    query_clean in loc["name"].lower()
                    or query_clean in loc.get("zip_code", "").lower()
                    or query_clean in loc["country"].lower()
                ):
                    return {
                        "name": loc["name"],
                        "region": loc["region"],
                        "country": loc["country"],
                        "latitude": loc["latitude"],
                        "longitude": loc["longitude"],
                    }

        # Fallback to default
        return DEFAULT_LOCATION.copy()

    @staticmethod
    def search_locations(
        query: str, db: Optional[Session] = None
    ) -> List[SearchResultItem]:
        """Search locations matching the query and log search history."""
        if not query or not query.strip():
            return []

        clean_q = query.strip()
        clean_lower = clean_q.lower()
        results: List[SearchResultItem] = []
        seen_ids = set()

        # Search DB
        resolved_first_id = None
        if db:
            db_matches = (
                db.query(CachedLocation)
                .filter(
                    (CachedLocation.name.ilike(f"%{clean_lower}%"))
                    | (CachedLocation.zip_code.ilike(f"%{clean_lower}%"))
                    | (CachedLocation.country.ilike(f"%{clean_lower}%"))
                )
                .limit(10)
                .all()
            )

            for match in db_matches:
                if match.id not in seen_ids:
                    seen_ids.add(match.id)
                    if not resolved_first_id:
                        resolved_first_id = match.id
                    results.append(
                        SearchResultItem(
                            id=match.id,
                            name=match.name,
                            region=match.region,
                            country=match.country,
                            latitude=match.latitude,
                            longitude=match.longitude,
                        )
                    )

        # Search built-in known locations
        for loc in KNOWN_LOCATIONS:
            if (
                clean_lower in loc["name"].lower()
                or clean_lower in loc.get("zip_code", "").lower()
                or clean_lower in loc["country"].lower()
            ):
                if loc["id"] not in seen_ids:
                    seen_ids.add(loc["id"])
                    if not resolved_first_id:
                        resolved_first_id = loc["id"]
                    results.append(
                        SearchResultItem(
                            id=loc["id"],
                            name=loc["name"],
                            region=loc["region"],
                            country=loc["country"],
                            latitude=loc["latitude"],
                            longitude=loc["longitude"],
                        )
                    )

        # Log to search_history
        if db:
            try:
                history_entry = SearchHistory(
                    search_query=clean_q,
                    resolved_location_id=resolved_first_id,
                )
                db.add(history_entry)
                db.commit()
            except Exception:
                db.rollback()

        return results

    @staticmethod
    def get_current_weather(
        location_data: Dict[str, Any],
        unit: str = "fahrenheit",
    ) -> CurrentWeatherResponse:
        """Fetch current weather with caching and unit conversion."""
        lat = location_data["latitude"]
        lon = location_data["longitude"]
        unit_clean = unit.lower() if unit in ["celsius", "fahrenheit"] else "fahrenheit"
        cache_key = f"weather:current:{lat:.4f},{lon:.4f}:{unit_clean}"

        cached = cache_service.get(cache_key)
        if cached:
            return CurrentWeatherResponse(**cached)

        # Generate realistic weather based on coordinates and current time
        # Deterministic simulation with natural variations
        base_f = 72.0 + (lat % 10) - (lon % 5)
        temp_val = convert_temp(base_f, unit_clean)
        feels_like_val = convert_temp(base_f - 0.5, unit_clean)

        now_str = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

        res = CurrentWeatherResponse(
            location=LocationSchema(
                name=location_data["name"],
                region=location_data.get("region"),
                country=location_data.get("country", "United States"),
                latitude=lat,
                longitude=lon,
            ),
            current=CurrentWeatherDetail(
                temperature=temp_val,
                unit=unit_clean,
                condition="Sunny",
                condition_icon="sunny",
                humidity_percent=45.0,
                wind_speed_mph=8.5,
                feels_like=feels_like_val,
                timestamp=now_str,
            ),
        )

        cache_service.set(cache_key, res.model_dump(), ttl_seconds=600)
        return res

    @staticmethod
    def get_forecast(
        location_data: Dict[str, Any],
        days: int = 7,
        unit: str = "fahrenheit",
    ) -> ForecastResponse:
        """Fetch multi-day weather forecast breakdown."""
        days = max(1, min(7, days))
        lat = location_data["latitude"]
        lon = location_data["longitude"]
        unit_clean = unit.lower() if unit in ["celsius", "fahrenheit"] else "fahrenheit"
        cache_key = f"weather:forecast:{lat:.4f},{lon:.4f}:{days}:{unit_clean}"

        cached = cache_service.get(cache_key)
        if cached:
            return ForecastResponse(**cached)

        today = datetime.utcnow()
        conditions = [
            ("Sunny", "sunny", 10, 45),
            ("Partly Cloudy", "partly-cloudy", 20, 50),
            ("Cloudy", "cloudy", 35, 60),
            ("Rain Showers", "rainy", 65, 75),
            ("Sunny", "sunny", 5, 40),
            ("Scattered Clouds", "partly-cloudy", 15, 48),
            ("Clear", "sunny", 0, 42),
        ]

        forecast_items: List[DailyForecastItem] = []
        base_high_f = 78.0 + (lat % 5)
        base_low_f = 58.0 + (lat % 5)

        for i in range(days):
            day_dt = today + timedelta(days=i)
            cond_name, cond_icon, precip, hum = conditions[i % len(conditions)]
            high_f = base_high_f + (i * 1.5 % 6) - 2.0
            low_f = base_low_f + (i * 1.2 % 5) - 2.0

            forecast_items.append(
                DailyForecastItem(
                    date=day_dt.strftime("%Y-%m-%d"),
                    day_name=day_dt.strftime("%A"),
                    temp_high=convert_temp(high_f, unit_clean),
                    temp_low=convert_temp(low_f, unit_clean),
                    condition=cond_name,
                    condition_icon=cond_icon,
                    precipitation_chance_percent=float(precip),
                    humidity_percent=float(hum),
                )
            )

        res = ForecastResponse(
            location=LocationSchema(
                name=location_data["name"],
                region=location_data.get("region"),
                country=location_data.get("country", "United States"),
                latitude=lat,
                longitude=lon,
            ),
            forecast=forecast_items,
        )

        cache_service.set(cache_key, res.model_dump(), ttl_seconds=1800)
        return res

    @staticmethod
    def get_trends(
        location_data: Dict[str, Any],
        timeframe: str = "24h",
        unit: str = "fahrenheit",
    ) -> TrendsResponse:
        """Fetch hourly (24h) or daily (7d) temperature trend data points."""
        timeframe_clean = "7d" if timeframe.lower() == "7d" else "24h"
        lat = location_data["latitude"]
        lon = location_data["longitude"]
        unit_clean = unit.lower() if unit in ["celsius", "fahrenheit"] else "fahrenheit"
        cache_key = f"weather:trends:{lat:.4f},{lon:.4f}:{timeframe_clean}:{unit_clean}"

        cached = cache_service.get(cache_key)
        if cached:
            return TrendsResponse(**cached)

        now = datetime.utcnow()
        trend_points: List[TrendPoint] = []

        if timeframe_clean == "24h":
            # 24 hours of data
            base_temp_f = 68.0 + (lat % 5)
            # Generate 24 hourly points starting from now - 12h to now + 11h or next 24h
            for hour in range(24):
                dt = now + timedelta(hours=hour)
                # Diurnal temperature cycle: low at 4 AM, high at 3 PM
                hour_val = dt.hour
                if 4 <= hour_val <= 15:
                    cycle = (hour_val - 4) / 11.0  # 0 to 1
                elif hour_val > 15:
                    cycle = 1.0 - ((hour_val - 15) / 13.0)
                else:
                    cycle = hour_val / 4.0 * 0.2

                f_val = base_temp_f + (cycle * 16.0) - 4.0
                converted_temp = convert_temp(f_val, unit_clean)

                time_label = (
                    dt.strftime("%-I %p")
                    if hasattr(dt, "strftime")
                    else f"{dt.hour}:00"
                )
                # Standard format without leading zero
                time_label = dt.strftime("%I %p").lstrip("0")

                condition = "Sunny" if 6 <= hour_val <= 19 else "Clear"
                trend_points.append(
                    TrendPoint(
                        timestamp=dt.strftime("%Y-%m-%dT%H:00:00Z"),
                        time_label=time_label,
                        temperature=converted_temp,
                        condition=condition,
                    )
                )
        else:
            # 7 days of daily trends
            base_temp_f = 72.0 + (lat % 5)
            for d in range(7):
                dt = now + timedelta(days=d)
                f_val = base_temp_f + (d * 1.5 % 7) - 3.0
                converted_temp = convert_temp(f_val, unit_clean)
                trend_points.append(
                    TrendPoint(
                        timestamp=dt.strftime("%Y-%m-%dT12:00:00Z"),
                        time_label=dt.strftime("%a"),
                        temperature=converted_temp,
                        condition="Partly Cloudy" if d % 2 == 1 else "Sunny",
                    )
                )

        # Calculate peak high and overnight low
        max_point = max(trend_points, key=lambda p: p.temperature)
        min_point = min(trend_points, key=lambda p: p.temperature)

        summary = TrendSummary(
            peak_high=max_point.temperature,
            peak_high_time=max_point.timestamp,
            overnight_low=min_point.temperature,
            overnight_low_time=min_point.timestamp,
        )

        res = TrendsResponse(
            location=LocationSchema(
                name=location_data["name"],
                region=location_data.get("region"),
                country=location_data.get("country", "United States"),
                latitude=lat,
                longitude=lon,
            ),
            timeframe=timeframe_clean,
            unit=unit_clean,
            trend_points=trend_points,
            summary=summary,
        )

        cache_service.set(cache_key, res.model_dump(), ttl_seconds=600)
        return res
