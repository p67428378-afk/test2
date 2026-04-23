from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import schemas, services, models
from .database import get_db
from fastapi.responses import Response

router = APIRouter()

@router.post("/certificates/balance", response_class=Response)
def generate_balance_certificate(
    request: schemas.CertificateRequestCreate, db: Session = Depends(get_db)
):
    """
    Generate a balance certificate for a given account and purpose.
    """
    # 1. Create a record of the request
    db_request = services.create_certificate_request(db, request)

    # 2. Fetch account details from CBS (mocked)
    try:
        account_details = services.get_account_details_from_cbs(request.accountNumber)
    except Exception as e:
        db_request.status = models.StatusEnum.FAILED
        db.commit()
        raise HTTPException(status_code=503, detail=f"Could not connect to Core Banking System: {e}")

    if not account_details:
        db_request.status = models.StatusEnum.FAILED
        db.commit()
        raise HTTPException(status_code=404, detail="Account not found")

    # 3. Generate PDF
    pdf_bytes = services.generate_pdf_certificate(db_request, account_details)

    # 4. Digitally sign the PDF (mocked)
    signed_pdf_bytes = services.sign_pdf(pdf_bytes)

    # 5. Update request status and save path (path is conceptual here)
    db_request.status = models.StatusEnum.GENERATED
    db_request.generatedPdfPath = f"/certificates/{db_request.requestId}.pdf"
    db.commit()

    # 6. Return the PDF as a response
    return Response(
        content=signed_pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Balance_Certificate_{db_request.requestId}.pdf"
        },
    )
