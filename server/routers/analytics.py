from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from server.database import get_db
from server import schemas, crud

router = APIRouter(prefix="/api/v1/analytics", tags=["Crowd Analytics"])


@router.post("/crowd/telemetry", status_code=status.HTTP_201_CREATED)
def ingest_telemetry(
    telemetry_req: schemas.TelemetryIngestRequest, db: Session = Depends(get_db)
):
    event = crud.ingest_telemetry(db, telemetry_req)
    return {
        "status": "SUCCESS",
        "event_id": event.id,
        "current_occupancy": event.current_occupancy,
    }


@router.get("/crowd", response_model=List[schemas.ZoneCrowdStatus])
def get_crowd_analytics(db: Session = Depends(get_db)):
    return crud.get_crowd_analytics(db)
