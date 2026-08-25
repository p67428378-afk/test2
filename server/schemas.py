from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class CityBase(BaseModel):
    name: str
    state: Optional[str] = None
    country: str
    latitude: float
    longitude: float


class CityCreate(CityBase):
    pass


class CityResponse(CityBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SearchStatisticsResponse(BaseModel):
    id: str
    city_id: str
    search_count: int
    last_searched_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# Weather schemas
class CurrentWeather(BaseModel):
    temp: float
    humidity: int
    wind_speed: float
    pressure: int
    description: str
    icon: str


class DailyForecast(BaseModel):
    date: str
    day_of_week: str
    temp_max: float
    temp_min: float
    description: str
    icon: str


class HourlyForecast(BaseModel):
    time: str
    date: str
    temp: float
    description: str
    icon: str


class WeatherForecastResponse(BaseModel):
    current: CurrentWeather
    daily_forecasts: List[DailyForecast]
    hourly_forecasts: List[HourlyForecast]
