from fastapi import FastAPI, Depends, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from contextlib import asynccontextmanager

from server.config import settings
from server.database import get_db, init_db, seed_data
from server.schemas import CityResponse, WeatherForecastResponse
from server.services import search_cities_service, get_weather_forecast_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database and seed data on startup
    init_db()
    db = next(get_db())
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Weather Dashboard API",
    description="API for searching cities and fetching weather forecasts with caching",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
allowed_origins = [
    origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/v1/weather/search", response_model=List[CityResponse])
def search_cities(
    q: str = Query(..., description="City name to search for"),
    db: Session = Depends(get_db),
):
    if not q.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query cannot be empty",
        )

    cities = search_cities_service(db, q)
    return cities


@app.get("/api/v1/weather/forecast", response_model=WeatherForecastResponse)
def get_weather_forecast(
    lat: float = Query(..., description="Latitude of the location"),
    lon: float = Query(..., description="Longitude of the location"),
    units: str = Query(
        "metric", description="Units of measurement (metric or imperial)"
    ),
):
    if units not in ["metric", "imperial"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Units must be either 'metric' or 'imperial'",
        )

    forecast = get_weather_forecast_service(lat, lon, units)
    return forecast
