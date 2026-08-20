from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Hive, TelemetryLog, HoneyHarvest, DiseaseReport, Inspection
from server.schemas import SeasonalAnalyticsResponse, SeasonalTrendPoint

router = APIRouter(prefix="/api/v1/analytics", tags=["Seasonal Analytics"])


@router.get("/seasonal", response_model=SeasonalAnalyticsResponse)
def get_seasonal_analytics(
    hive_id: Optional[str] = None,
    season: str = "Summer",
    year: Optional[int] = None,
    db: Session = Depends(get_db),
):
    current_year = year or datetime.utcnow().year

    # Base queries filtered by hive if specified
    t_query = db.query(TelemetryLog)
    h_query = db.query(HoneyHarvest)
    d_query = db.query(DiseaseReport)
    i_query = db.query(Inspection)
    hive_query = db.query(Hive)

    if hive_id:
        t_query = t_query.filter(TelemetryLog.hive_id == hive_id)
        h_query = h_query.filter(HoneyHarvest.hive_id == hive_id)
        d_query = d_query.filter(DiseaseReport.hive_id == hive_id)
        i_query = i_query.filter(Inspection.hive_id == hive_id)
        hive_query = hive_query.filter(Hive.id == hive_id)

    # Aggregations
    total_harvest = db.query(func.coalesce(func.sum(HoneyHarvest.quantity_kg), 0.0))
    if hive_id:
        total_harvest = total_harvest.filter(HoneyHarvest.hive_id == hive_id)
    total_harvest_kg = float(total_harvest.scalar() or 0.0)

    avg_temp_res = db.query(func.avg(TelemetryLog.temperature_celsius))
    if hive_id:
        avg_temp_res = avg_temp_res.filter(TelemetryLog.hive_id == hive_id)
    avg_temp = float(avg_temp_res.scalar() or 34.5)

    avg_hum_res = db.query(func.avg(TelemetryLog.humidity_percent))
    if hive_id:
        avg_hum_res = avg_hum_res.filter(TelemetryLog.hive_id == hive_id)
    avg_hum = float(avg_hum_res.scalar() or 60.0)

    # Sum of estimated population across hives
    total_pop_res = db.query(func.coalesce(func.sum(Hive.estimated_population), 0))
    if hive_id:
        total_pop_res = total_pop_res.filter(Hive.id == hive_id)
    estimated_pop = int(total_pop_res.scalar() or 0)

    # Disease alert count
    disease_count = d_query.count()

    # Completed inspections
    completed_inspections = i_query.filter(Inspection.status == "completed").count()

    # Build simple daily/weekly trend points from telemetry & harvests
    recent_telemetry = t_query.order_by(TelemetryLog.recorded_at.desc()).limit(10).all()
    trends: List[SeasonalTrendPoint] = []
    for log in reversed(recent_telemetry):
        date_str = log.recorded_at.strftime("%Y-%m-%d")
        trends.append(
            SeasonalTrendPoint(
                date=date_str,
                avg_temperature=round(log.temperature_celsius, 1),
                avg_humidity=round(log.humidity_percent, 1),
                total_harvest_kg=round(total_harvest_kg, 1),
            )
        )

    return SeasonalAnalyticsResponse(
        hive_id=hive_id,
        season=season,
        year=current_year,
        total_harvest_yield_kg=round(total_harvest_kg, 2),
        avg_temperature_celsius=round(avg_temp, 2),
        avg_humidity_percent=round(avg_hum, 2),
        estimated_bee_population=estimated_pop,
        active_disease_alerts_count=disease_count,
        completed_inspections_count=completed_inspections,
        trends=trends,
    )
