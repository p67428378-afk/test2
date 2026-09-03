import math
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from server.models.parking import (
    ParkingLocation,
    HourlyRate,
    ParkingSpot,
    StatusEvent,
)
from server.schemas.parking import (
    ParkingLocationCreate,
    ParkingSpotSearchResult,
    RatesBreakdownResponse,
    CostCalculationResponse,
)


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in kilometers using the Haversine formula."""
    r = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(r * c, 2)


class ParkingService:
    @staticmethod
    def search_spots(
        db: Session,
        lat: Optional[float] = None,
        lng: Optional[float] = None,
        radius_km: Optional[float] = 5.0,
        max_rate: Optional[float] = None,
        spot_type: Optional[str] = None,
        category: Optional[str] = None,
        has_ev_charging: Optional[bool] = None,
        sort_by: Optional[str] = "distance",
    ) -> List[ParkingSpotSearchResult]:
        query = db.query(ParkingLocation)

        # Category filter (Case-insensitive) - If unselected or empty, display all by default
        if category and category.strip():
            query = query.filter(
                func.lower(ParkingLocation.category) == func.lower(category.strip())
            )

        if spot_type and spot_type.strip():
            query = query.filter(
                func.lower(ParkingLocation.spot_type) == func.lower(spot_type.strip())
            )

        if has_ev_charging is not None and has_ev_charging:
            query = query.filter(ParkingLocation.has_ev_charging == True)  # noqa: E712

        locations = query.all()
        results = []

        ref_lat = lat if lat is not None else 37.789
        ref_lng = lng if lng is not None else -122.401

        for loc in locations:
            dist = calculate_distance(ref_lat, ref_lng, loc.latitude, loc.longitude)
            if radius_km is not None and dist > radius_km:
                continue

            rate_obj = loc.rates[0] if loc.rates else None
            hourly_rate = rate_obj.base_rate_per_hour if rate_obj else 5.0

            if max_rate is not None and hourly_rate > max_rate:
                continue

            results.append(
                ParkingSpotSearchResult(
                    spot_id=loc.id,
                    name=loc.name,
                    address=loc.address,
                    latitude=loc.latitude,
                    longitude=loc.longitude,
                    distance_km=dist,
                    hourly_rate=hourly_rate,
                    status=loc.status,
                    available_spots=loc.available_spots,
                    total_capacity=loc.total_capacity,
                    has_ev_charging=loc.has_ev_charging,
                    spot_type=loc.spot_type,
                    category=loc.category or "Car",
                )
            )

        # Sort results
        if sort_by == "price":
            results.sort(key=lambda x: x.hourly_rate)
        elif sort_by == "capacity":
            results.sort(key=lambda x: x.available_spots, reverse=True)
        elif sort_by == "name":
            results.sort(key=lambda x: x.name.lower())
        else:  # distance default
            results.sort(key=lambda x: x.distance_km)

        return results

    @staticmethod
    def list_locations(
        db: Session, skip: int = 0, limit: int = 20
    ) -> List[ParkingLocation]:
        return db.query(ParkingLocation).offset(skip).limit(limit).all()

    @staticmethod
    def get_location_by_id(db: Session, location_id: str) -> ParkingLocation:
        location = (
            db.query(ParkingLocation)
            .filter(ParkingLocation.id == location_id)
            .first()
        )
        if not location:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parking location '{location_id}' not found",
            )
        return location

    @staticmethod
    def get_spot_rates(
        db: Session, spot_id: str, target_date: Optional[str] = None
    ) -> RatesBreakdownResponse:
        location = ParkingService.get_location_by_id(db, spot_id)
        rate_obj = location.rates[0] if location.rates else None

        base = rate_obj.base_rate_per_hour if rate_obj else 5.00
        peak = rate_obj.peak_rate_per_hour if rate_obj else 8.00
        off_peak = rate_obj.off_peak_rate_per_hour if rate_obj else 3.50
        weekend = rate_obj.weekend_rate_per_hour if rate_obj else 4.00
        max_daily = rate_obj.max_daily_rate if rate_obj else 35.00

        now = datetime.now(timezone.utc)
        current_hour = now.hour
        is_peak = 8 <= current_hour <= 18 and now.weekday() < 5
        current_active = peak if is_peak else off_peak

        breakdown = {
            "base_rate": base,
            "peak_rate": peak,
            "peak_hours": "08:00 - 18:00 (Mon-Fri)",
            "off_peak_rate": off_peak,
            "weekend_rate": weekend,
            "max_daily_cap": max_daily,
        }

        return RatesBreakdownResponse(
            spot_id=spot_id,
            base_hourly_rate=base,
            current_active_rate=current_active,
            is_peak=is_peak,
            max_daily_cap=max_daily,
            rate_breakdown=breakdown,
        )

    @staticmethod
    def calculate_cost(
        db: Session,
        spot_id: str,
        hours: float,
        start_time: Optional[str] = None,
    ) -> CostCalculationResponse:
        rates_data = ParkingService.get_spot_rates(db, spot_id)
        active_rate = rates_data.current_active_rate
        uncapped_cost = hours * active_rate
        total_cost = min(uncapped_cost, rates_data.max_daily_cap)
        max_cap_applied = uncapped_cost > rates_data.max_daily_cap

        return CostCalculationResponse(
            spot_id=spot_id,
            hours=hours,
            total_cost=round(total_cost, 2),
            rate_applied=active_rate,
            is_peak=rates_data.is_peak,
            max_daily_cap_applied=max_cap_applied,
        )

    @staticmethod
    def update_spot_status(
        db: Session,
        spot_id: str,
        new_status: Optional[str] = None,
        available_spots: Optional[int] = None,
    ) -> ParkingLocation:
        location = ParkingService.get_location_by_id(db, spot_id)

        old_status = location.status
        if new_status:
            location.status = new_status
        if available_spots is not None:
            location.available_spots = max(0, min(available_spots, location.total_capacity))

        location.updated_at = datetime.now(timezone.utc)

        # Record event
        event = StatusEvent(
            id=str(uuid.uuid4()),
            location_id=location.id,
            spot_id=location.id,
            event=f"status_updated_{location.status}",
            status=location.status,
            available_spots=location.available_spots,
            timestamp=datetime.now(timezone.utc),
        )
        db.add(event)
        db.commit()
        db.refresh(location)
        return location

    @staticmethod
    def create_location(
        db: Session, location_in: ParkingLocationCreate
    ) -> ParkingLocation:
        now = datetime.now(timezone.utc)
        location = ParkingLocation(
            id=str(uuid.uuid4()),
            name=location_in.name,
            address=location_in.address,
            latitude=location_in.latitude,
            longitude=location_in.longitude,
            spot_type=location_in.spot_type,
            category=location_in.category or "Car",
            has_ev_charging=location_in.has_ev_charging,
            total_capacity=location_in.total_capacity,
            available_spots=location_in.available_spots,
            status=location_in.status,
            created_at=now,
            updated_at=now,
        )
        db.add(location)
        db.flush()

        if location_in.rates:
            rate = HourlyRate(
                id=str(uuid.uuid4()),
                location_id=location.id,
                base_rate_per_hour=location_in.rates.base_rate_per_hour,
                peak_rate_per_hour=location_in.rates.peak_rate_per_hour,
                off_peak_rate_per_hour=location_in.rates.off_peak_rate_per_hour,
                weekend_rate_per_hour=location_in.rates.weekend_rate_per_hour,
                max_daily_rate=location_in.rates.max_daily_rate,
                created_at=now,
                updated_at=now,
            )
            db.add(rate)

        db.commit()
        db.refresh(location)
        return location

    @staticmethod
    def get_recent_events(db: Session, limit: int = 20) -> List[StatusEvent]:
        return (
            db.query(StatusEvent)
            .order_by(StatusEvent.timestamp.desc())
            .limit(limit)
            .all()
        )
