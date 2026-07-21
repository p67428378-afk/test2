from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from server.database import get_db
from server import crud, schemas

router = APIRouter(prefix="/fuel", tags=["fuel"])


@router.get("/summary", response_model=schemas.FuelSummaryResponse)
def read_fuel_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
):
    logs = crud.get_fuel_logs(db=db, start_date=start_date, end_date=end_date)

    total_fuel = sum(log.fuel_consumed for log in logs)
    total_dist = sum(log.distance_traveled for log in logs)

    # Calculate average efficiency as total_distance / total_fuel
    # If total_fuel is 0, efficiency is 0.0
    avg_efficiency = total_dist / total_fuel if total_fuel > 0 else 0.0

    return schemas.FuelSummaryResponse(
        average_efficiency=round(avg_efficiency, 2),
        total_distance_traveled=round(total_dist, 2),
        total_fuel_consumed=round(total_fuel, 2),
        logs=[schemas.FuelLogResponse.model_validate(log) for log in logs],
    )


@router.post(
    "/logs", response_model=schemas.FuelLogResponse, status_code=status.HTTP_201_CREATED
)
def create_fuel_log(log: schemas.FuelLogCreate, db: Session = Depends(get_db)):
    return crud.create_fuel_log(db=db, log=log)
