from typing import List, Optional
from pydantic import BaseModel


class LocationSchema(BaseModel):
    name: str
    region: Optional[str] = None
    country: str = "United States"
    latitude: float
    longitude: float


class CurrentWeatherDetail(BaseModel):
    temperature: float
    unit: str = "fahrenheit"
    condition: str
    condition_icon: str
    humidity_percent: float
    wind_speed_mph: float
    feels_like: float
    timestamp: str


class CurrentWeatherResponse(BaseModel):
    location: LocationSchema
    current: CurrentWeatherDetail


class DailyForecastItem(BaseModel):
    date: str
    day_name: str
    temp_high: float
    temp_low: float
    condition: str
    condition_icon: str
    precipitation_chance_percent: float
    humidity_percent: float


class ForecastResponse(BaseModel):
    location: LocationSchema
    forecast: List[DailyForecastItem]


class TrendPoint(BaseModel):
    timestamp: str
    time_label: str
    temperature: float
    condition: str


class TrendSummary(BaseModel):
    peak_high: float
    peak_high_time: str
    overnight_low: float
    overnight_low_time: str


class TrendsResponse(BaseModel):
    location: LocationSchema
    timeframe: str = "24h"
    unit: str = "fahrenheit"
    trend_points: List[TrendPoint]
    summary: TrendSummary


class SearchResultItem(BaseModel):
    id: str
    name: str
    region: Optional[str] = None
    country: str
    latitude: float
    longitude: float


class SearchResponse(BaseModel):
    results: List[SearchResultItem]
