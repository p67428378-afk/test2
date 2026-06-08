from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import Dict
from server.database import get_db
from server.schemas import CertificateRequestCreate, CertificateRequestResponse, CertificateListResponse
from server.crud import create_certificate_request, get_certificate_request, get_certificate_requests, update_certificate_request
from server.services.otp_service import OTPService
from server.services.cbs_service import CBSService
from server.services.pdf_service import PDFService
from server.services.signing_service import SigningService

router = APIRouter()

# In-memory storage for generated PDF bytes
# Key: certificate_request_id (str), Value: pdf_bytes (bytes)
PDF_STORAGE: Dict[str, bytes] = {}

@router.post("", response_model=CertificateRequestResponse, status_code=201)
def request_certificate(payload: CertificateRequestCreate, db: Session = Depends(get_db)):
    account_number = payload.account_number
    otp = payload.otp
    purpose = payload.purpose

    # 1. Validate OTP
    if not OTPService.validate_otp(account_number, otp):
        # Log failed request in DB
        create_certificate_request(
            db=db,
            customer_id="UNKNOWN",
            account_number=account_number,
            purpose=purpose,
            status="FAILED",
            failure_reason="OTP validation failed"
        )
        raise HTTPException(status_code=400, detail="OTP validation failed")

    # 2. Fetch Account Details from CBS
    account_details = CBSService.fetch_account_details(account_number)
    if not account_details:
        # Log failed request in DB
        create_certificate_request(
            db=db,
            customer_id="UNKNOWN",
            account_number=account_number,
            purpose=purpose,
            status="FAILED",
            failure_reason="Account number not found in CBS"
        )
        raise HTTPException(status_code=404, detail="Account number not found in CBS")

    customer_id = account_details["customer_id"]

    # Create initial pending/success record in DB
    db_obj = create_certificate_request(
        db=db,
        customer_id=customer_id,
        account_number=account_number,
        purpose=purpose,
        status="PENDING"
    )

    # 3. Generate PDF Certificate
    try:
        pdf_bytes = PDFService.generate_balance_certificate(account_number, account_details, purpose)
    except Exception as e:
        update_certificate_request(db, db_obj, status="FAILED", failure_reason=f"Failed to generate PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate certificate")

    # 4. Digitally Sign PDF
    try:
        signed_pdf_bytes = SigningService.sign_pdf(pdf_bytes)
    except Exception as e:
        update_certificate_request(db, db_obj, status="FAILED", failure_reason=f"Failed to sign PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to sign certificate")

    # 5. Store PDF bytes and update DB record
    PDF_STORAGE[db_obj.id] = signed_pdf_bytes
    generated_pdf_url = f"/api/v1/certificates/{db_obj.id}/download"
    
    update_certificate_request(
        db=db,
        db_obj=db_obj,
        status="SUCCESS",
        generated_pdf_url=generated_pdf_url
    )

    return db_obj

@router.get("", response_model=CertificateListResponse)
def list_certificates(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    items, total = get_certificate_requests(db, skip=skip, limit=limit)
    page = (skip // limit) + 1
    return {
        "items": items,
        "page": page,
        "total": total
    }

@router.get("/{id}/download")
def download_certificate(id: str, db: Session = Depends(get_db)):
    db_obj = get_certificate_request(db, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Certificate request not found")
    
    if db_obj.status != "SUCCESS" or id not in PDF_STORAGE:
        raise HTTPException(status_code=404, detail="PDF not generated yet or request failed")

    pdf_bytes = PDF_STORAGE[id]
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=balance_certificate_{id}.pdf"}
    )
