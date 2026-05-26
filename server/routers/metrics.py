from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas
from ..database import get_db

router = APIRouter()

@router.get("/engagement-metrics", response_model=List[schemas.EngagementMetric])
def read_engagement_metrics(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    metrics = crud.get_engagement_metrics(db, skip=skip, limit=limit)
    return metrics
