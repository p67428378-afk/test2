from sqlalchemy.orm import Session
from app.models.kyc import CustomerKYC, KYCAuditLog, KYCStatus
from app.schemas.kyc import KYCCreate
import uuid

def create_kyc_record(db: Session, kyc_in: KYCCreate, initiator: str):
    db_kyc = CustomerKYC(
        customer_id=kyc_in.customer_id,
        aadhaar_number=kyc_in.aadhaar_number, # In a real app, this would be encrypted
        pan_number=kyc_in.pan_number, # In a real app, this would be encrypted
    )
    db.add(db_kyc)
    db.commit()
    db.refresh(db_kyc)

    log_audit(db, db_kyc.id, "KYC_SUBMITTED", {"customer_id": kyc_in.customer_id}, "System", "SUCCESS", initiator)

    return db_kyc

def get_kyc_status(db: Session, kyc_id: uuid.UUID):
    return db.query(CustomerKYC).filter(CustomerKYC.id == kyc_id).first()

def get_audit_trail(db: Session, kyc_id: uuid.UUID):
    return db.query(KYCAuditLog).filter(KYCAuditLog.kyc_id == kyc_id).all()

def log_audit(db: Session, kyc_id: uuid.UUID, event_type: str, details: dict, service: str, outcome: str, initiator: str):
    audit_log = KYCAuditLog(
        kyc_id=kyc_id,
        event_type=event_type,
        event_details=details,
        service_involved=service,
        outcome=outcome,
        initiator=initiator
    )
    db.add(audit_log)
    db.commit()
