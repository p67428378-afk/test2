from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import TelemetryLog, Hive
from server.schemas import (
    TelemetryIngestRequest,
    TelemetryIngestResponse,
    TelemetryLogResponse,
)
from server.services.telemetry_service import evaluate_telemetry_thresholds

router = APIRouter(prefix="/api/v1/telemetry", tags=["Telemetry"])


@router.post(
    "", response_model=TelemetryIngestResponse, status_code=status.HTTP_201_CREATED
)
def ingest_telemetry(payload: TelemetryIngestRequest, db: Session = Depends(get_db)):
    hive = db.query(Hive).filter(Hive.id == payload.hive_id).first()
    if not hive:
        raise HTTPException(
            status_code=404, detail=f"Hive '{payload.hive_id}' not found."
        )

    recorded_at = payload.recorded_at or datetime.utcnow()

    telemetry_log = TelemetryLog(
        hive_id=payload.hive_id,
        temperature_celsius=payload.temperature_celsius,
        humidity_percent=payload.humidity_percent,
        weight_kg=payload.weight_kg,
        recorded_at=recorded_at,
    )
    db.add(telemetry_log)

    alert_triggered, alert_message = evaluate_telemetry_thresholds(
        payload.temperature_celsius, payload.humidity_percent
    )

    db.commit()
    db.refresh(telemetry_log)

    return TelemetryIngestResponse(
        id=telemetry_log.id,
        hive_id=telemetry_log.hive_id,
        status="ingested",
        alert_triggered=alert_triggered,
        alert_message=alert_message,
    )


@router.get("", response_model=List[TelemetryLogResponse])
def get_telemetry_logs(
    hive_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(TelemetryLog)
    if hive_id:
        query = query.filter(TelemetryLog.hive_id == hive_id)

    logs = (
        query.order_by(TelemetryLog.recorded_at.desc()).offset(skip).limit(limit).all()
    )
    return logs
