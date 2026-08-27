from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas.weather import (
    CurrentWeatherResponse,
    ForecastResponse,
    TrendsResponse,
    SearchResponse,
)
from server.services.weather_service import WeatherService

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/current", response_model=CurrentWeatherResponse)
def get_current_weather(
    location: Optional[str] = Query(None, description="City name or zip code"),
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude"),
    unit: str = Query(
        "fahrenheit", description="Temperature unit: fahrenheit or celsius"
    ),
    db: Session = Depends(get_db),
):
    """Retrieve current weather conditions for a specified location or coordinates."""
    resolved_loc = WeatherService.resolve_location(
        db=db,
        location_query=location,
        lat=lat,
        lon=lon,
    )
    return WeatherService.get_current_weather(location_data=resolved_loc, unit=unit)


@router.get("/forecast", response_model=ForecastResponse)
def get_weather_forecast(
    location: Optional[str] = Query(None, description="City name or zip code"),
    days: int = Query(7, ge=1, le=7, description="Number of forecast days (1-7)"),
    unit: str = Query(
        "fahrenheit", description="Temperature unit: fahrenheit or celsius"
    ),
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude"),
    db: Session = Depends(get_db),
):
    """Retrieve multi-day weather forecast breakdown for a location."""
    resolved_loc = WeatherService.resolve_location(
        db=db,
        location_query=location,
        lat=lat,
        lon=lon,
    )
    return WeatherService.get_forecast(location_data=resolved_loc, days=days, unit=unit)


@router.get("/trends", response_model=TrendsResponse)
def get_weather_trends(
    location: Optional[str] = Query(None, description="City name or zip code"),
    timeframe: str = Query("24h", description="Timeframe: 24h or 7d"),
    unit: str = Query(
        "fahrenheit", description="Temperature unit: fahrenheit or celsius"
    ),
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude"),
    db: Session = Depends(get_db),
):
    """Retrieve hourly and daily temperature trend data points for interactive charts."""
    resolved_loc = WeatherService.resolve_location(
        db=db,
        location_query=location,
        lat=lat,
        lon=lon,
    )
    return WeatherService.get_trends(
        location_data=resolved_loc, timeframe=timeframe, unit=unit
    )


@router.get("/locations/search", response_model=SearchResponse)
def search_locations(
    query: str = Query(
        ..., min_length=1, description="Search query string (city name or zip code)"
    ),
    db: Session = Depends(get_db),
):
    """Search locations by query string for autocomplete and search inputs."""
    results = WeatherService.search_locations(query=query, db=db)
    return SearchResponse(results=results)
