from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from server.database import get_db
from server import crud, schemas

router = APIRouter(prefix="/schedules", tags=["schedules"])


@router.post(
    "", response_model=schemas.ScheduleResponse, status_code=status.HTTP_201_CREATED
)
def create_schedule(schedule: schemas.ScheduleCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_schedule(db=db, schedule=schedule)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("", response_model=List[schemas.ScheduleResponse])
def read_schedules(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return crud.get_schedules(
        db=db,
        start_date=start_date,
        end_date=end_date,
        status=status,
        skip=skip,
        limit=limit,
    )


@router.get("/{schedule_id}", response_model=schemas.ScheduleResponse)
def read_schedule(schedule_id: UUID, db: Session = Depends(get_db)):
    db_schedule = crud.get_schedule(db=db, schedule_id=schedule_id)
    if db_schedule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )
    return db_schedule


@router.put("/{schedule_id}", response_model=schemas.ScheduleResponse)
def update_schedule(
    schedule_id: UUID, schedule: schemas.ScheduleUpdate, db: Session = Depends(get_db)
):
    db_schedule = crud.get_schedule(db=db, schedule_id=schedule_id)
    if db_schedule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found"
        )

    # Validate date range if dates are being updated
    start = schedule.start_date or db_schedule.start_date
    end = schedule.end_date or db_schedule.end_date
    if start and end and end < start:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="end_date cannot be before start_date",
        )

    try:
        return crud.update_schedule(db=db, db_schedule=db_schedule, schedule=schedule)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
