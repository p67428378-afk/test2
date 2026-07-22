from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import (
    User,
    Hive,
    SensorData,
    ProductionLog,
    PopulationLog,
    Inspection,
    DiseaseReport,
)
from server.schemas import (
    HiveCreate,
    HiveResponse,
    HiveListResponse,
    HiveDetailResponse,
    LatestSensorData,
    SensorDataCreate,
    SensorDataResponse,
    ProductionLogCreate,
    ProductionLogResponse,
    PopulationLogCreate,
    PopulationLogResponse,
    InspectionCreate,
    InspectionResponse,
    DiseaseReportCreate,
    DiseaseReportResponse,
)
from server.auth import get_current_user

router = APIRouter(prefix="/hives", tags=["hives"])


@router.get("", response_model=List[HiveListResponse])
def get_hives(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    hives = db.query(Hive).filter(Hive.user_id == current_user.id).all()

    results = []
    for hive in hives:
        # Get latest sensor data
        latest_sensor = (
            db.query(SensorData)
            .filter(SensorData.hive_id == hive.id)
            .order_by(SensorData.timestamp.desc())
            .first()
        )

        latest_sensor_data = None
        if latest_sensor:
            latest_sensor_data = LatestSensorData(
                temperature=latest_sensor.temperature,
                humidity=latest_sensor.humidity,
                timestamp=latest_sensor.timestamp,
            )

        results.append(
            HiveListResponse(
                id=hive.id,
                name=hive.name,
                location=hive.location,
                status=hive.status,
                honey_capacity_pct=hive.honey_capacity_pct,
                latest_sensor_data=latest_sensor_data,
            )
        )
    return results


@router.post("", response_model=HiveResponse, status_code=status.HTTP_201_CREATED)
def create_hive(
    hive_in: HiveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if hive_in.honey_capacity_pct < 0.0 or hive_in.honey_capacity_pct > 100.0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Honey capacity percentage must be between 0 and 100",
        )

    new_hive = Hive(
        user_id=current_user.id,
        name=hive_in.name,
        location=hive_in.location,
        status=hive_in.status,
        honey_capacity_pct=hive_in.honey_capacity_pct,
    )
    db.add(new_hive)
    db.commit()
    db.refresh(new_hive)
    return new_hive


@router.get("/{hive_id}", response_model=HiveDetailResponse)
def get_hive_detail(
    hive_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hive = (
        db.query(Hive)
        .filter(Hive.id == hive_id, Hive.user_id == current_user.id)
        .first()
    )
    if not hive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Hive not found"
        )

    # Get sensor history for the last 24 hours
    cutoff = datetime.utcnow() - timedelta(hours=24)
    sensor_history = (
        db.query(SensorData)
        .filter(SensorData.hive_id == hive.id, SensorData.timestamp >= cutoff)
        .order_by(SensorData.timestamp.asc())
        .all()
    )

    # Get other logs
    production_logs = (
        db.query(ProductionLog)
        .filter(ProductionLog.hive_id == hive.id)
        .order_by(ProductionLog.date.desc())
        .all()
    )
    population_logs = (
        db.query(PopulationLog)
        .filter(PopulationLog.hive_id == hive.id)
        .order_by(PopulationLog.date.desc())
        .all()
    )
    inspections = (
        db.query(Inspection)
        .filter(Inspection.hive_id == hive.id)
        .order_by(Inspection.inspection_date.desc())
        .all()
    )
    disease_reports = (
        db.query(DiseaseReport)
        .filter(DiseaseReport.hive_id == hive.id)
        .order_by(DiseaseReport.report_date.desc())
        .all()
    )

    return HiveDetailResponse(
        id=hive.id,
        name=hive.name,
        location=hive.location,
        status=hive.status,
        honey_capacity_pct=hive.honey_capacity_pct,
        sensor_history_24h=sensor_history,
        production_logs=production_logs,
        population_logs=population_logs,
        inspections=inspections,
        disease_reports=disease_reports,
    )


@router.post(
    "/{hive_id}/sensor-data",
    response_model=SensorDataResponse,
    status_code=status.HTTP_201_CREATED,
)
def post_sensor_data(
    hive_id: str,
    data_in: SensorDataCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hive = (
        db.query(Hive)
        .filter(Hive.id == hive_id, Hive.user_id == current_user.id)
        .first()
    )
    if not hive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Hive not found"
        )

    new_sensor_data = SensorData(
        hive_id=hive.id,
        temperature=data_in.temperature,
        humidity=data_in.humidity,
        timestamp=data_in.timestamp,
    )
    db.add(new_sensor_data)
    db.commit()
    db.refresh(new_sensor_data)
    return new_sensor_data


@router.post(
    "/{hive_id}/production-logs",
    response_model=ProductionLogResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_production_log(
    hive_id: str,
    log_in: ProductionLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hive = (
        db.query(Hive)
        .filter(Hive.id == hive_id, Hive.user_id == current_user.id)
        .first()
    )
    if not hive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Hive not found"
        )

    new_log = ProductionLog(
        hive_id=hive.id, date=log_in.date, quantity_kg=log_in.quantity_kg
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@router.post(
    "/{hive_id}/population-logs",
    response_model=PopulationLogResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_population_log(
    hive_id: str,
    log_in: PopulationLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hive = (
        db.query(Hive)
        .filter(Hive.id == hive_id, Hive.user_id == current_user.id)
        .first()
    )
    if not hive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Hive not found"
        )

    new_log = PopulationLog(
        hive_id=hive.id,
        date=log_in.date,
        estimated_population=log_in.estimated_population,
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@router.post(
    "/{hive_id}/inspections",
    response_model=InspectionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_inspection(
    hive_id: str,
    inspection_in: InspectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hive = (
        db.query(Hive)
        .filter(Hive.id == hive_id, Hive.user_id == current_user.id)
        .first()
    )
    if not hive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Hive not found"
        )

    new_inspection = Inspection(
        hive_id=hive.id,
        inspection_date=inspection_in.inspection_date,
        inspector=inspection_in.inspector,
        focus_area=inspection_in.focus_area,
        notes=inspection_in.notes,
    )
    db.add(new_inspection)
    db.commit()
    db.refresh(new_inspection)
    return new_inspection


@router.post(
    "/{hive_id}/disease-reports",
    response_model=DiseaseReportResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_disease_report(
    hive_id: str,
    report_in: DiseaseReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hive = (
        db.query(Hive)
        .filter(Hive.id == hive_id, Hive.user_id == current_user.id)
        .first()
    )
    if not hive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Hive not found"
        )

    new_report = DiseaseReport(
        hive_id=hive.id,
        report_date=report_in.report_date,
        symptoms=report_in.symptoms,
        severity=report_in.severity,
        observations=report_in.observations,
        status=report_in.status or "pending",
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report
