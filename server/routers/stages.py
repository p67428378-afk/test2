from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import schemas, crud

router = APIRouter(prefix="/api/v1/stages", tags=["Stages & Scheduling"])


@router.get("", response_model=List[schemas.StageResponse])
def list_stages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_stages(db, skip=skip, limit=limit)


@router.post(
    "", response_model=schemas.StageResponse, status_code=status.HTTP_201_CREATED
)
def create_stage(stage_data: schemas.StageCreate, db: Session = Depends(get_db)):
    return crud.create_stage(db, stage_data)


@router.get("/{stage_id}", response_model=schemas.StageResponse)
def get_stage(stage_id: str, db: Session = Depends(get_db)):
    stage = crud.get_stage(db, stage_id)
    if not stage:
        raise HTTPException(status_code=404, detail="Stage not found")
    return stage


@router.get(
    "/{stage_id}/performances", response_model=List[schemas.PerformanceResponse]
)
def list_stage_performances(stage_id: str, db: Session = Depends(get_db)):
    stage = crud.get_stage(db, stage_id)
    if not stage:
        raise HTTPException(status_code=404, detail="Stage not found")
    return crud.get_stage_performances(db, stage_id)


@router.post(
    "/{stage_id}/performances",
    response_model=schemas.PerformanceResponse,
    status_code=status.HTTP_201_CREATED,
)
def allocate_performance(
    stage_id: str, perf_data: schemas.PerformanceCreate, db: Session = Depends(get_db)
):
    return crud.create_performance(db, stage_id, perf_data)


@router.post(
    "/{stage_id}/performances/{performance_id}/delay",
    response_model=List[schemas.PerformanceResponse],
)
def delay_stage_performance(
    stage_id: str,
    performance_id: str,
    req: schemas.PerformanceDelayRequest,
    db: Session = Depends(get_db),
):
    return crud.delay_performance(db, performance_id, req.delay_minutes)


@router.get(
    "/{stage_id}/notifications", response_model=List[schemas.StageNotificationResponse]
)
def get_stage_notifications(stage_id: str, db: Session = Depends(get_db)):
    return crud.get_stage_notifications(db, stage_id)
