from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/stations", response_model=List[schemas.StationResponse])
def read_stations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = Query(None, description="Search by station name or code"),
    db: Session = Depends(get_db),
):
    """Search and list transit stations."""
    return crud.get_stations(db, skip=skip, limit=limit, search=search)


@router.get(
    "/stations/{station_id}/schedules",
    response_model=List[schemas.StationScheduleResponse],
)
def read_station_schedules(
    station_id: str,
    db: Session = Depends(get_db),
):
    """Search arrival schedules and calculated live ETAs for a station."""
    station = crud.get_station_by_id(db, station_id=station_id)
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station with ID '{station_id}' not found.",
        )
    return crud.get_schedules_for_station(db, station_id=station_id)
