from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import DiseaseReport, Hive
from server.schemas import DiseaseReportCreate, DiseaseReportResponse

router = APIRouter(prefix="/api/v1/diseases", tags=["Diseases & Health"])


@router.get("/reports", response_model=List[DiseaseReportResponse])
def list_disease_reports(
    hive_id: Optional[str] = None,
    severity_level: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(DiseaseReport)
    if hive_id:
        query = query.filter(DiseaseReport.hive_id == hive_id)
    if severity_level:
        query = query.filter(DiseaseReport.severity_level == severity_level)

    reports = (
        query.order_by(DiseaseReport.report_date.desc()).offset(skip).limit(limit).all()
    )
    return reports


@router.post(
    "/reports",
    response_model=DiseaseReportResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_disease_report(payload: DiseaseReportCreate, db: Session = Depends(get_db)):
    hive = db.query(Hive).filter(Hive.id == payload.hive_id).first()
    if not hive:
        raise HTTPException(
            status_code=404, detail=f"Hive '{payload.hive_id}' not found."
        )

    report_date = payload.report_date or datetime.utcnow()

    report = DiseaseReport(
        hive_id=payload.hive_id,
        disease_name=payload.disease_name,
        severity_level=payload.severity_level,
        symptoms_description=payload.symptoms_description,
        treatment_applied=payload.treatment_applied,
        report_date=report_date,
    )
    db.add(report)

    # Automatically update hive status to quarantined if severe/critical
    if payload.severity_level.lower() in ["critical", "high"]:
        hive.status = "quarantined"

    db.commit()
    db.refresh(report)
    return report
