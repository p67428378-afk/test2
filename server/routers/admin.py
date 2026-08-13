from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from server.database import get_db
from server.models.user import User, UserRole
from server.models.tanker import Tanker, TankerStatus
from server.models.booking import Booking, BookingStatus
from server.schemas.admin import AdminAnalyticsResponse
from server.auth import require_roles

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/analytics", response_model=AdminAnalyticsResponse)
def get_analytics(
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.OPERATOR)),
    db: Session = Depends(get_db),
):
    # 1. Total Active Bookings
    active_statuses = [
        BookingStatus.PENDING_ASSIGNMENT,
        BookingStatus.ASSIGNED,
        BookingStatus.EN_ROUTE,
        BookingStatus.ARRIVED,
        BookingStatus.DISCHARGING,
    ]
    total_active_bookings = (
        db.query(Booking).filter(Booking.status.in_(active_statuses)).count()
    )

    # 2. Fleet Utilization Rate
    total_tankers = db.query(Tanker).count()
    in_use_tankers = (
        db.query(Tanker).filter(Tanker.status == TankerStatus.IN_USE).count()
    )
    fleet_utilization_rate = (
        (in_use_tankers / total_tankers * 100.0) if total_tankers > 0 else 0.0
    )

    # 3. Total Volume Liters
    total_volume_result = (
        db.query(func.sum(Booking.volume_liters))
        .filter(Booking.status == BookingStatus.COMPLETED)
        .scalar()
    )
    total_volume_liters = total_volume_result if total_volume_result is not None else 0

    # 4. Avg Fulfillment Duration (in minutes)
    completed_bookings = (
        db.query(Booking).filter(Booking.status == BookingStatus.COMPLETED).all()
    )
    if completed_bookings:
        durations = [
            (b.updated_at - b.created_at).total_seconds() / 60.0
            for b in completed_bookings
            if b.updated_at and b.created_at
        ]
        avg_fulfillment_duration_mins = (
            sum(durations) / len(durations) if durations else 0.0
        )
    else:
        avg_fulfillment_duration_mins = 0.0

    # 5. Peak Demand Zone / Surge Zone
    # Top address by booking count
    top_zone_query = (
        db.query(Booking.delivery_address, func.count(Booking.id).label("cnt"))
        .group_by(Booking.delivery_address)
        .order_by(func.count(Booking.id).desc())
        .first()
    )
    demand_surge_zone = top_zone_query[0] if top_zone_query else "North Zone"

    return AdminAnalyticsResponse(
        total_active_bookings=total_active_bookings,
        fleet_utilization_rate=round(fleet_utilization_rate, 2),
        avg_fulfillment_duration_mins=round(avg_fulfillment_duration_mins, 2),
        total_volume_liters=total_volume_liters,
        demand_surge_zone=demand_surge_zone,
    )
