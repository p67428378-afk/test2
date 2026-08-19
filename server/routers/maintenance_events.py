from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import (
    MaintenanceEventCreate,
    MaintenanceEventUpdate,
    MaintenanceEventResponse,
    MaintenanceEventListResponse,
    CostSummaryResponse,
)
from server.services import maintenance_service

router = APIRouter(prefix="/api/v1/maintenance-events", tags=["Maintenance Events"])


@router.get("/summary", response_model=CostSummaryResponse)
def get_cost_summary(
    start_date: Optional[datetime] = Query(None, description="Start date filter"),
    end_date: Optional[datetime] = Query(None, description="End date filter"),
    location: Optional[str] = Query(None, description="Location filter"),
    db: Session = Depends(get_db),
):
    return maintenance_service.get_cost_summary(
        db, start_date=start_date, end_date=end_date, location=location
    )


@router.get("/export")
def export_maintenance_events_csv(
    start_date: Optional[datetime] = Query(None, description="Start date filter"),
    end_date: Optional[datetime] = Query(None, description="End date filter"),
    location: Optional[str] = Query(None, description="Location filter"),
    maintenance_type: Optional[str] = Query(
        None, description="Maintenance type filter"
    ),
    db: Session = Depends(get_db),
):
    csv_data = maintenance_service.export_maintenance_csv(
        db,
        start_date=start_date,
        end_date=end_date,
        location=location,
        maintenance_type=maintenance_type,
    )
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": 'attachment; filename="wifi_maintenance_export.csv"'
        },
    )


@router.post(
    "/", response_model=MaintenanceEventResponse, status_code=status.HTTP_201_CREATED
)
def create_maintenance_event(
    event_in: MaintenanceEventCreate,
    db: Session = Depends(get_db),
):
    return maintenance_service.create_maintenance_event(db, event_in)


@router.get("/", response_model=MaintenanceEventListResponse)
def list_maintenance_events(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(20, ge=1, le=100, description="Max items to return"),
    search: Optional[str] = Query(
        None, description="Keyword search across text fields"
    ),
    location: Optional[str] = Query(None, description="Filter by location"),
    maintenance_type: Optional[str] = Query(
        None, description="Filter by maintenance type"
    ),
    start_date: Optional[datetime] = Query(None, description="Filter start timestamp"),
    end_date: Optional[datetime] = Query(None, description="Filter end timestamp"),
    min_cost: Optional[float] = Query(None, ge=0.0, description="Minimum cost filter"),
    max_cost: Optional[float] = Query(None, ge=0.0, description="Maximum cost filter"),
    db: Session = Depends(get_db),
):
    items, total = maintenance_service.list_maintenance_events(
        db,
        skip=skip,
        limit=limit,
        search=search,
        location=location,
        maintenance_type=maintenance_type,
        start_date=start_date,
        end_date=end_date,
        min_cost=min_cost,
        max_cost=max_cost,
    )
    return MaintenanceEventListResponse(
        items=items, total=total, skip=skip, limit=limit
    )


@router.get("/{event_id}", response_model=MaintenanceEventResponse)
def get_maintenance_event(
    event_id: str,
    db: Session = Depends(get_db),
):
    event = maintenance_service.get_maintenance_event(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance event with ID '{event_id}' not found",
        )
    return event


@router.put("/{event_id}", response_model=MaintenanceEventResponse)
def update_maintenance_event(
    event_id: str,
    event_in: MaintenanceEventUpdate,
    db: Session = Depends(get_db),
):
    updated = maintenance_service.update_maintenance_event(db, event_id, event_in)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance event with ID '{event_id}' not found",
        )
    return updated


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_maintenance_event(
    event_id: str,
    db: Session = Depends(get_db),
):
    deleted = maintenance_service.delete_maintenance_event(db, event_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance event with ID '{event_id}' not found",
        )
    return None
