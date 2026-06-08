from sqlalchemy.orm import Session
from server.models import CertificateRequest
from datetime import datetime

def create_certificate_request(db: Session, customer_id: str, account_number: str, purpose: str, status: str, failure_reason: str = None, generated_pdf_url: str = None):
    db_obj = CertificateRequest(
        customer_id=customer_id,
        account_number=account_number,
        purpose=purpose,
        status=status,
        failure_reason=failure_reason,
        generated_pdf_url=generated_pdf_url
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_certificate_request(db: Session, request_id: str):
    return db.query(CertificateRequest).filter(CertificateRequest.id == request_id).first()

def get_certificate_requests(db: Session, skip: int = 0, limit: int = 20):
    query = db.query(CertificateRequest)
    total = query.count()
    items = query.order_by(CertificateRequest.created_at.desc()).offset(skip).limit(limit).all()
    return items, total

def update_certificate_request(db: Session, db_obj: CertificateRequest, status: str, failure_reason: str = None, generated_pdf_url: str = None):
    db_obj.status = status
    if failure_reason is not None:
        db_obj.failure_reason = failure_reason
    if generated_pdf_url is not None:
        db_obj.generated_pdf_url = generated_pdf_url
    db_obj.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_obj)
    return db_obj
