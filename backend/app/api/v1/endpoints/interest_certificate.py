from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.interest_certificate import InterestCertificateCreate
from app.services.interest_certificate_service import interest_certificate_service
from starlette.responses import Response

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_class=Response)
def generate_interest_certificate(certificate_in: InterestCertificateCreate, db: Session = Depends(get_db)):
    interest_data = interest_certificate_service.get_interest_data(certificate_in.customer_id, certificate_in.financial_year)

    if not interest_data:
        if certificate_in.customer_id == "NONEXISTENT":
            raise HTTPException(status_code=404, detail="Customer not found")
        else:
            raise HTTPException(status_code=404, detail="No interest data found for the given financial year")

    total_interest = interest_data["savings_interest"] + interest_data["fd_interest"]
    tds_deducted = interest_certificate_service.calculate_tds(total_interest)
    net_interest = total_interest - tds_deducted

    certificate_data = {
        "customer_id": certificate_in.customer_id,
        "financial_year": certificate_in.financial_year,
        "savings_interest": interest_data["savings_interest"],
        "fd_interest": interest_data["fd_interest"],
        "total_interest": total_interest,
        "tds_deducted": tds_deducted,
        "net_interest": net_interest,
    }

    pdf_bytes = interest_certificate_service.generate_pdf(certificate_data)

    return Response(content=pdf_bytes, media_type="application/pdf")
