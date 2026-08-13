import json
import asyncio
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Stage, GateScan, Shift, CrowdTelemetry
from server.schemas import CrowdDensityResponse, CrowdDensityStage

router = APIRouter(prefix="/api/v1", tags=["Crowd Analytics & Heatmap"])


@router.get("/crowd/density", response_model=CrowdDensityResponse)
def get_crowd_density(db: Session = Depends(get_db)):
    stages = db.query(Stage).all()

    # Calculate valid scans total
    total_valid_scans = (
        db.query(GateScan).filter(GateScan.scan_result == "VALID").count()
    )

    # Active volunteers (volunteers in ACTIVE shifts)
    active_volunteers = db.query(Shift).filter(Shift.status == "ACTIVE").count()

    stage_metrics: List[CrowdDensityStage] = []
    total_occupancy = 0

    for idx, stage in enumerate(stages):
        # Calculate stage occupancy based on valid scans allocated or telemetry
        telemetry = (
            db.query(CrowdTelemetry)
            .filter(CrowdTelemetry.stage_id == stage.id)
            .order_by(CrowdTelemetry.timestamp.desc())
            .first()
        )

        if telemetry:
            curr_occ = telemetry.current_occupancy
        else:
            # Estimate occupancy based on valid scans distributed across stages
            curr_occ = int(total_valid_scans * (0.5 if idx == 0 else 0.25))

        max_cap = stage.capacity if stage.capacity > 0 else 5000
        occ_ratio = round(curr_occ / max_cap, 2)

        if occ_ratio >= 0.85:
            alert_status = "THRESHOLD_EXCEEDED_85"
        elif occ_ratio >= 0.95:
            alert_status = "CRITICAL"
        else:
            alert_status = "NORMAL"

        total_occupancy += curr_occ

        stage_metrics.append(
            CrowdDensityStage(
                stage_id=str(stage.id),
                stage_name=stage.name,
                location_zone=stage.location_zone,
                current_occupancy=curr_occ,
                max_capacity=max_cap,
                occupancy_ratio=occ_ratio,
                alert_status=alert_status,
            )
        )

    return CrowdDensityResponse(
        total_attendees=total_occupancy if total_occupancy > 0 else total_valid_scans,
        active_scans_per_min=max(12, total_valid_scans * 2),
        active_volunteers=active_volunteers if active_volunteers > 0 else 15,
        active_stages=len(stages),
        stages=stage_metrics,
    )


@router.get("/telemetry/stream")
async def telemetry_stream(db: Session = Depends(get_db)):
    """Server-Sent Events (SSE) stream broadcasting crowd density updates."""

    async def event_generator():
        stages = db.query(Stage).all()
        while True:
            for stage in stages:
                telemetry = (
                    db.query(CrowdTelemetry)
                    .filter(CrowdTelemetry.stage_id == stage.id)
                    .order_by(CrowdTelemetry.timestamp.desc())
                    .first()
                )
                curr_occ = (
                    telemetry.current_occupancy
                    if telemetry
                    else int(stage.capacity * 0.4)
                )
                max_cap = stage.capacity
                ratio = round(curr_occ / max_cap, 2)
                alert = "THRESHOLD_EXCEEDED_85" if ratio >= 0.85 else "NORMAL"

                data = {
                    "event": "CROWD_UPDATE",
                    "stage_id": str(stage.id),
                    "stage_name": stage.name,
                    "current_occupancy": curr_occ,
                    "max_capacity": max_cap,
                    "occupancy_ratio": ratio,
                    "alert_status": alert,
                    "timestamp": datetime.utcnow().isoformat(),
                }
                yield f"data: {json.dumps(data)}\n\n"
                await asyncio.sleep(2)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
