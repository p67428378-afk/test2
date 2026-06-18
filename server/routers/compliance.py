from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.compliance import (
    ComplianceCheckRequest,
    ComplianceCheckResponse,
    ComplianceReportResponse,
)
from server.services.compliance_service import ComplianceService

router = APIRouter()


@router.post("/compliance-checks", response_model=ComplianceCheckResponse)
def run_compliance_check(
    request: ComplianceCheckRequest, db: Session = Depends(get_db)
):
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    # Run compliance check (mocked)
    check = ComplianceService.run_checks(
        payment_id="N/A",  # Standalone check
        amount=request.amount,
        beneficiary_name=request.beneficiary_name,
        currency=request.currency,
        destination_country=request.destination_country,
        db=db,
    )

    return ComplianceCheckResponse(
        check_id=check.check_id,
        details=check.details,
        risk_score=float(check.risk_score),
        sanction_screen_status=check.sanction_screen_status,
        status=check.status,
    )


@router.get("/compliance/reports", response_model=ComplianceReportResponse)
def get_compliance_reports(
    start_date: str = Query(..., description="Start date (ISO 8601)"),
    end_date: str = Query(..., description="End date (ISO 8601)"),
    format: str = Query("pdf", description="Report format (pdf|csv)"),
    db: Session = Depends(get_db),
):
    try:
        start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        end_dt = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Invalid date format. Use ISO 8601."
        )

    if format.lower() not in ["pdf", "csv"]:
        raise HTTPException(
            status_code=400, detail="Invalid format. Supported: pdf, csv."
        )

    report = ComplianceService.generate_regulatory_report(start_dt, end_dt, format, db)

    return ComplianceReportResponse(
        report_id=report["report_id"],
        generated_at=report["generated_at"],
        download_url=report["download_url"],
    )
