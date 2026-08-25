import time
import uuid
import requests
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from server.config import settings
from server.models import City, SearchStatistics
from fastapi import HTTPException, status


class WeatherCache:
    def __init__(self, ttl_seconds: int = 1800):
        self.ttl = ttl_seconds
        self.cache: Dict[str, Dict[str, Any]] = {}

    def get(self, key: str, allow_expired: bool = False) -> Optional[Any]:
        if key in self.cache:
            entry = self.cache[key]
            is_expired = time.time() - entry["timestamp"] >= self.ttl
            if not is_expired or allow_expired:
                return entry["data"]
            if is_expired:
                del self.cache[key]
        return None

    def set(self, key: str, data: Any):
        self.cache[key] = {"timestamp": time.time(), "data": data}

    def clear(self):
        self.cache.clear()


weather_cache = WeatherCache()


def get_utc_now():
    return datetime.now(timezone.utc)


def search_cities_service(db: Session, query: str) -> List[City]:
    if not query.strip():
        return []

    # Try calling OpenWeatherMap Geocoding API
    api_url = f"http://api.openweathermap.org/geo/1.0/direct?q={query}&limit=10&appid={settings.OPENWEATHER_API_KEY}"

    try:
        response = requests.get(api_url, timeout=10)
        if response.status_code == 200:
            geo_data = response.json()
            results = []
            for item in geo_data:
                name = item.get("name")
                state = item.get("state")
                country = item.get("country")
                lat = item.get("lat")
                lon = item.get("lon")

                if name is None or lat is None or lon is None or country is None:
                    continue

                # Check if city already exists in DB
                # We match on name, state, country, and close lat/lon
                city = (
                    db.query(City)
                    .filter(
                        City.name == name, City.state == state, City.country == country
                    )
                    .first()
                )

                if not city:
                    city = City(
                        id=str(uuid.uuid4()),
                        name=name,
                        state=state,
                        country=country,
                        latitude=lat,
                        longitude=lon,
                    )
                    db.add(city)
                    db.commit()
                    db.refresh(city)

                # Update search statistics
                stats = (
                    db.query(SearchStatistics)
                    .filter(SearchStatistics.city_id == city.id)
                    .first()
                )
                if not stats:
                    stats = SearchStatistics(
                        id=str(uuid.uuid4()),
                        city_id=city.id,
                        search_count=1,
                        last_searched_at=get_utc_now(),
                    )
                    db.add(stats)
                else:
                    stats.search_count += 1
                    stats.last_searched_at = get_utc_now()

                db.commit()
                results.append(city)

            return results
        else:
            # If API returns non-200, fallback to local DB search
            return _local_city_search(db, query)
    except Exception:
        # If API is down or network error, fallback to local DB search
        return _local_city_search(db, query)


def _local_city_search(db: Session, query: str) -> List[City]:
    cities = db.query(City).filter(City.name.ilike(f"%{query}%")).all()
    for city in cities:
        stats = (
            db.query(SearchStatistics)
            .filter(SearchStatistics.city_id == city.id)
            .first()
        )
        if not stats:
            stats = SearchStatistics(
                id=str(uuid.uuid4()),
                city_id=city.id,
                search_count=1,
                last_searched_at=get_utc_now(),
            )
            db.add(stats)
        else:
            stats.search_count += 1
            stats.last_searched_at = get_utc_now()
        db.commit()
    return cities


def get_weather_forecast_service(
    lat: float, lon: float, units: str = "metric"
) -> Dict[str, Any]:
    cache_key = f"weather:{lat}:{lon}:{units}"

    # Check cache first
    cached_data = weather_cache.get(cache_key)
    if cached_data:
        return cached_data

    # Fetch from OpenWeatherMap API
    # We need current weather and 5-day forecast
    current_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units={units}&appid={settings.OPENWEATHER_API_KEY}"
    forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units={units}&appid={settings.OPENWEATHER_API_KEY}"

    try:
        current_resp = requests.get(current_url, timeout=10)
        forecast_resp = requests.get(forecast_url, timeout=10)

        if current_resp.status_code == 200 and forecast_resp.status_code == 200:
            current_data = current_resp.json()
            forecast_data = forecast_resp.json()

            # Parse current weather
            current_weather = {
                "temp": current_data["main"]["temp"],
                "humidity": current_data["main"]["humidity"],
                "wind_speed": current_data["wind"]["speed"],
                "pressure": current_data["main"]["pressure"],
                "description": current_data["weather"][0]["description"].title(),
                "icon": current_data["weather"][0]["icon"],
            }

            # Parse 5-day forecast (daily high/low, weather description, icon)
            # OpenWeatherMap returns 3-hour intervals. We group them by date.
            daily_groups: Dict[str, List[Dict[str, Any]]] = {}
            for item in forecast_data["list"]:
                dt_txt = item["dt_txt"]  # "YYYY-MM-DD HH:MM:SS"
                date_str = dt_txt.split(" ")[0]
                if date_str not in daily_groups:
                    daily_groups[date_str] = []
                daily_groups[date_str].append(item)

            daily_forecasts = []
            # Sort dates to ensure chronological order
            sorted_dates = sorted(daily_groups.keys())

            # We want up to 5 days
            for date_str in sorted_dates[:5]:
                items = daily_groups[date_str]
                # Use temp_max and temp_min from the API response if available, otherwise fallback to temp
                temp_maxs = [
                    x["main"].get("temp_max", x["main"]["temp"]) for x in items
                ]
                temp_mins = [
                    x["main"].get("temp_min", x["main"]["temp"]) for x in items
                ]
                temp_max = max(temp_maxs)
                temp_min = min(temp_mins)

                # Find the midday forecast or the first one for description/icon
                midday_item = None
                for x in items:
                    if "12:00:00" in x["dt_txt"]:
                        midday_item = x
                        break
                if not midday_item:
                    midday_item = items[len(items) // 2]

                dt_obj = datetime.strptime(date_str, "%Y-%m-%d")
                day_of_week = dt_obj.strftime("%A")

                daily_forecasts.append(
                    {
                        "date": date_str,
                        "day_of_week": day_of_week,
                        "temp_max": temp_max,
                        "temp_min": temp_min,
                        "description": midday_item["weather"][0]["description"].title(),
                        "icon": midday_item["weather"][0]["icon"],
                    }
                )

            # Parse hourly forecasts (3-hour intervals for trend chart)
            hourly_forecasts = []
            for item in forecast_data["list"][
                :15
            ]:  # Return first 15 intervals (~45 hours) for trend chart
                dt_txt = item["dt_txt"]
                date_str = dt_txt.split(" ")[0]
                time_str = dt_txt.split(" ")[1][:5]  # "HH:MM"
                hourly_forecasts.append(
                    {
                        "time": time_str,
                        "date": date_str,
                        "temp": item["main"]["temp"],
                        "description": item["weather"][0]["description"].title(),
                        "icon": item["weather"][0]["icon"],
                    }
                )

            result = {
                "current": current_weather,
                "daily_forecasts": daily_forecasts,
                "hourly_forecasts": hourly_forecasts,
            }

            # Save to cache
            weather_cache.set(cache_key, result)
            return result
        else:
            # If API returns error, try to serve expired cache
            expired_data = weather_cache.get(cache_key, allow_expired=True)
            if expired_data:
                return expired_data
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="External weather service is currently unavailable. Please try again later.",
            )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        # On network error, try to serve expired cache
        expired_data = weather_cache.get(cache_key, allow_expired=True)
        if expired_data:
            return expired_data
        raise HTTPException(
            status_code=status.HTTP_530_SERVICE_UNAVAILABLE
            if hasattr(status, "HTTP_530_SERVICE_UNAVAILABLE")
            else 503,
            detail="External weather service is currently unavailable. Please try again later.",
        )
