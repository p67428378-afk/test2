from typing import Optional
from pydantic import BaseModel


class AdminAnalyticsResponse(BaseModel):
    total_active_bookings: int
    fleet_utilization_rate: float
    avg_fulfillment_duration_mins: float
    total_volume_liters: int
    demand_surge_zone: Optional[str] = None
