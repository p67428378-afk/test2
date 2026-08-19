import io
import csv
import uuid
from datetime import datetime, timezone
from typing import Optional, Tuple, List, Dict
from sqlalchemy import or_
from sqlalchemy.orm import Session

from server.models import MaintenanceEvent
from server.schemas import (
    MaintenanceEventCreate,
    MaintenanceEventUpdate,
    MonthlyTrend,
    CostSummaryResponse,
)


def create_maintenance_event(
    db: Session, data: MaintenanceEventCreate
) -> MaintenanceEvent:
    now = datetime.now(timezone.utc)
    event_id = str(uuid.uuid4())
    db_event = MaintenanceEvent(
        id=event_id,
        title=data.title,
        event_date=data.event_date,
        location=data.location,
        maintenance_type=data.maintenance_type,
        vendor_technician=data.vendor_technician,
        cost=data.cost,
        description=data.description,
        created_at=now,
        updated_at=now,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def get_maintenance_event(db: Session, event_id: str) -> Optional[MaintenanceEvent]:
    return db.query(MaintenanceEvent).filter(MaintenanceEvent.id == event_id).first()


def list_maintenance_events(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    location: Optional[str] = None,
    maintenance_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    min_cost: Optional[float] = None,
    max_cost: Optional[float] = None,
) -> Tuple[List[MaintenanceEvent], int]:
    query = db.query(MaintenanceEvent)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                MaintenanceEvent.title.ilike(search_pattern),
                MaintenanceEvent.location.ilike(search_pattern),
                MaintenanceEvent.maintenance_type.ilike(search_pattern),
                MaintenanceEvent.vendor_technician.ilike(search_pattern),
                MaintenanceEvent.description.ilike(search_pattern),
            )
        )

    if location:
        query = query.filter(MaintenanceEvent.location.ilike(f"%{location}%"))

    if maintenance_type:
        query = query.filter(
            MaintenanceEvent.maintenance_type.ilike(f"%{maintenance_type}%")
        )

    if start_date:
        query = query.filter(MaintenanceEvent.event_date >= start_date)

    if end_date:
        query = query.filter(MaintenanceEvent.event_date <= end_date)

    if min_cost is not None:
        query = query.filter(MaintenanceEvent.cost >= min_cost)

    if max_cost is not None:
        query = query.filter(MaintenanceEvent.cost <= max_cost)

    total = query.count()
    items = (
        query.order_by(MaintenanceEvent.event_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items, total


def update_maintenance_event(
    db: Session, event_id: str, data: MaintenanceEventUpdate
) -> Optional[MaintenanceEvent]:
    db_event = get_maintenance_event(db, event_id)
    if not db_event:
        return None

    update_dict = data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(db_event, field, value)

    db_event.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(db_event)
    return db_event


def delete_maintenance_event(db: Session, event_id: str) -> bool:
    db_event = get_maintenance_event(db, event_id)
    if not db_event:
        return False
    db.delete(db_event)
    db.commit()
    return True


def get_cost_summary(
    db: Session,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    location: Optional[str] = None,
) -> CostSummaryResponse:
    query = db.query(MaintenanceEvent)

    if start_date:
        query = query.filter(MaintenanceEvent.event_date >= start_date)
    if end_date:
        query = query.filter(MaintenanceEvent.event_date <= end_date)
    if location:
        query = query.filter(MaintenanceEvent.location.ilike(f"%{location}%"))

    events = query.all()

    if not events:
        return CostSummaryResponse(
            total_spend=0.0,
            total_events=0,
            cost_by_type={},
            cost_by_location={},
            monthly_trends=[],
        )

    total_spend = round(sum(e.cost for e in events), 2)
    total_events = len(events)

    cost_by_type: Dict[str, float] = {}
    cost_by_location: Dict[str, float] = {}
    trends_map: Dict[str, Tuple[float, int]] = {}  # month_str -> (total_cost, count)

    for e in events:
        # Cost by type
        cost_by_type[e.maintenance_type] = round(
            cost_by_type.get(e.maintenance_type, 0.0) + e.cost, 2
        )
        # Cost by location
        cost_by_location[e.location] = round(
            cost_by_location.get(e.location, 0.0) + e.cost, 2
        )
        # Monthly trends
        month_str = e.event_date.strftime("%Y-%m")
        curr_cost, curr_count = trends_map.get(month_str, (0.0, 0))
        trends_map[month_str] = (round(curr_cost + e.cost, 2), curr_count + 1)

    monthly_trends = [
        MonthlyTrend(month=m, total_cost=cost, event_count=cnt)
        for m, (cost, cnt) in sorted(trends_map.items())
    ]

    return CostSummaryResponse(
        total_spend=total_spend,
        total_events=total_events,
        cost_by_type=cost_by_type,
        cost_by_location=cost_by_location,
        monthly_trends=monthly_trends,
    )


def export_maintenance_csv(
    db: Session,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    location: Optional[str] = None,
    maintenance_type: Optional[str] = None,
) -> str:
    events, _ = list_maintenance_events(
        db,
        skip=0,
        limit=10000,
        start_date=start_date,
        end_date=end_date,
        location=location,
        maintenance_type=maintenance_type,
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        [
            "ID",
            "Title",
            "Event Date",
            "Location",
            "Maintenance Type",
            "Vendor/Technician",
            "Cost ($)",
            "Description",
            "Created At",
        ]
    )

    for e in events:
        writer.writerow(
            [
                e.id,
                e.title,
                e.event_date.isoformat(),
                e.location,
                e.maintenance_type,
                e.vendor_technician,
                f"{e.cost:.2f}",
                e.description or "",
                e.created_at.isoformat(),
            ]
        )

    return output.getvalue()
