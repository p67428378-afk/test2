import math
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from server import models, schemas
from server.database import get_db

router = APIRouter()


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points on the earth in km."""
    # Radius of the Earth in km
    R = 6371.0

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return distance


@router.get("/routes", response_model=List[schemas.RouteResponse])
def get_routes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = Query(None, description="Search by route number or name"),
    db: Session = Depends(get_db),
):
    """Get a list of all available bus routes with optional search filtering."""
    query = db.query(models.Route)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (models.Route.route_number.ilike(search_filter))
            | (models.Route.route_name.ilike(search_filter))
        )
    return query.order_by(models.Route.route_number).offset(skip).limit(limit).all()


@router.get("/routes/{route_id}/stops", response_model=List[schemas.StopResponse])
def get_route_stops(route_id: UUID, db: Session = Depends(get_db)):
    """Get all bus stops for a specific route, ordered by stop_order."""
    route = db.query(models.Route).filter(models.Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    route_stops = (
        db.query(models.RouteStop)
        .filter(models.RouteStop.route_id == route_id)
        .order_by(models.RouteStop.stop_order.asc())
        .all()
    )

    result = []
    for rs in route_stops:
        stop = db.query(models.Stop).filter(models.Stop.id == rs.stop_id).first()
        if stop:
            result.append(
                {
                    "id": stop.id,
                    "stop_name": stop.stop_name,
                    "location": {
                        "latitude": stop.latitude,
                        "longitude": stop.longitude,
                    },
                    "stop_order": rs.stop_order,
                }
            )
    return result


@router.get("/routes/{route_id}/buses", response_model=List[schemas.BusResponse])
def get_route_buses(route_id: UUID, db: Session = Depends(get_db)):
    """Get the real-time location of all active buses on a route."""
    route = db.query(models.Route).filter(models.Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    buses = db.query(models.Bus).filter(models.Bus.route_id == route_id).all()
    result = []
    for bus in buses:
        latest_loc = (
            db.query(models.BusLocation)
            .filter(models.BusLocation.bus_id == bus.id)
            .order_by(models.BusLocation.timestamp.desc())
            .first()
        )

        location = None
        timestamp = None
        if latest_loc:
            location = {
                "latitude": latest_loc.latitude,
                "longitude": latest_loc.longitude,
            }
            timestamp = latest_loc.timestamp

        result.append(
            {
                "id": bus.id,
                "vehicle_id": bus.vehicle_id,
                "route_id": bus.route_id,
                "location": location,
                "timestamp": timestamp,
            }
        )
    return result


@router.get("/stops/{stop_id}/eta", response_model=schemas.StopETAResponse)
def get_stop_eta(stop_id: UUID, db: Session = Depends(get_db)):
    """Get the estimated arrival times for a specific stop."""
    stop = db.query(models.Stop).filter(models.Stop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")

    # Find all routes passing through this stop
    route_stops = (
        db.query(models.RouteStop).filter(models.RouteStop.stop_id == stop_id).all()
    )

    etas = []
    for rs in route_stops:
        route = db.query(models.Route).filter(models.Route.id == rs.route_id).first()
        if not route:
            continue

        # Find all active buses on this route
        buses = db.query(models.Bus).filter(models.Bus.route_id == route.id).all()

        route_buses_etas = []
        for bus in buses:
            latest_loc = (
                db.query(models.BusLocation)
                .filter(models.BusLocation.bus_id == bus.id)
                .order_by(models.BusLocation.timestamp.desc())
                .first()
            )

            if latest_loc:
                # Calculate distance
                dist = haversine_distance(
                    latest_loc.latitude,
                    latest_loc.longitude,
                    stop.latitude,
                    stop.longitude,
                )
                # Calculate ETA in minutes (assume 30 km/h average speed)
                speed = 30.0
                minutes = (dist / speed) * 60.0
                eta_minutes = max(1, int(round(minutes)))

                route_buses_etas.append(
                    {
                        "route_id": route.id,
                        "route_number": route.route_number,
                        "vehicle_id": bus.vehicle_id,
                        "estimated_arrival_minutes": eta_minutes,
                    }
                )

        # Sort by ETA ascending and take the next two buses
        route_buses_etas.sort(key=lambda x: x["estimated_arrival_minutes"])
        etas.extend(route_buses_etas[:2])

    return {"stop_id": stop.id, "stop_name": stop.stop_name, "etas": etas}
