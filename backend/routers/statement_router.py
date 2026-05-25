from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas import StatementRequest
from backend.services.statement_service import StatementService
from fastapi.responses import StreamingResponse
import io

router = APIRouter()
statement_service = StatementService()

@router.post("/pdf", summary="Generate PDF Statement")
def generate_pdf_statement(request: StatementRequest, db: Session = Depends(get_db)):
    statement_data = statement_service.get_statement_data(db, request)
    if not statement_data:
        raise HTTPException(status_code=404, detail="Account not found")

    # Placeholder for PDF generation
    pdf_content = f"PDF for {statement_data.account_number}".encode('utf-8')
    return StreamingResponse(io.BytesIO(pdf_content), media_type="application/pdf")

@router.post("/excel", summary="Generate Excel Statement")
def generate_excel_statement(request: StatementRequest, db: Session = Depends(get_db)):
    statement_data = statement_service.get_statement_data(db, request)
    if not statement_data:
        raise HTTPException(status_code=404, detail="Account not found")

    # Placeholder for Excel generation
    excel_content = f"Excel for {statement_data.account_number}".encode('utf-8')
    return StreamingResponse(io.BytesIO(excel_content), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
