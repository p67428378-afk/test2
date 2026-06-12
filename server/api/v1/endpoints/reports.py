from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from datetime import datetime

from server import crud, models, schemas
from server.database import get_db

router = APIRouter()

@router.get("/reports", response_model=List[schemas.ReportResponse])
def list_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    reports = crud.get_reports(db, skip=skip, limit=limit)
    response = []
    for r in reports:
        customer_name = None
        if r.customer_id:
            customer = crud.get_customer_by_id(db, r.customer_id)
            if customer:
                customer_name = f"{customer.first_name} {customer.last_name}"
        response.append({
            "id": r.id,
            "customerName": customer_name,
            "reportType": r.report_type,
            "status": r.status,
            "xmlContent": r.xml_content,
            "createdDate": r.created_at
        })
    return response

@router.post("/reports/{id}/submit", response_model=schemas.ReportSubmitResponse)
def submit_report(id: UUID, db: Session = Depends(get_db)):
    report = crud.get_report_by_id(db, id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    # Mock submission to FIU-IND portal
    # If report type is invalid or some other condition, we could fail, but let's make it succeed
    updated_report = crud.update_report_status(db, report.id, "SUBMITTED")
    crud.create_audit_log(db, report.customer_id, "REPORT_SUBMITTED", "system", f"{report.report_type} report submitted to FIU-IND portal.")

    return {
        "id": updated_report.id,
        "status": "SUBMITTED",
        "submittedAt": datetime.utcnow()
    }
