
from sqlalchemy.orm import Session
from . import models, schemas
import requests
import uuid

def create_kyc_request(db: Session, request: schemas.KYCRequestCreate):
    db_request = models.KYCRequest(aadhaar_number=request.aadhaar_number, pan_number=request.pan_number)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    create_audit_log(db, db_request.id, "KYC_REQUEST_CREATED", "KYC request created")
    return db_request

def get_kyc_request(db: Session, request_id: uuid.UUID):
    return db.query(models.KYCRequest).filter(models.KYCRequest.id == request_id).first()

def create_audit_log(db: Session, kyc_request_id: uuid.UUID, action: str, details: str):
    db_audit = models.AuditTrail(kyc_request_id=kyc_request_id, action=action, details=details)
    db.add(db_audit)
    db.commit()

def validate_aadhaar(aadhaar_number: str):
    # Mocking UIDAI API call
    if aadhaar_number.isdigit() and len(aadhaar_number) == 12:
        return True
    return False

def validate_pan(pan_number: str):
    # Mocking NSDL API call
    if len(pan_number) == 10:
        return True
    return False

def check_sanctions_list(aadhaar_number: str, pan_number: str):
    # Mocking RBI sanctions list check
    return False

def validate_kyc_documents(db: Session, request_id: uuid.UUID):
    db_request = get_kyc_request(db, request_id)
    if not db_request:
        return {"error": "KYC request not found"}

    create_audit_log(db, db_request.id, "VALIDATION_STARTED", "Document validation process started")

    aadhaar_valid = validate_aadhaar(db_request.aadhaar_number)
    pan_valid = validate_pan(db_request.pan_number)

    if not aadhaar_valid:
        db_request.status = models.KYCStatus.FLAGGED
        db.commit()
        create_audit_log(db, db_request.id, "AADHAAR_VALIDATION_FAILED", "Aadhaar validation failed")
        return {"status": "FLAGGED", "reason": "Aadhaar validation failed"}

    create_audit_log(db, db_request.id, "AADHAAR_VALIDATION_SUCCESS", "Aadhaar validation successful")

    if not pan_valid:
        db_request.status = models.KYCStatus.FLAGGED
        db.commit()
        create_audit_log(db, db_request.id, "PAN_VALIDATION_FAILED", "PAN validation failed")
        return {"status": "FLAGGED", "reason": "PAN validation failed"}

    create_audit_log(db, db_request.id, "PAN_VALIDATION_SUCCESS", "PAN validation successful")

    sanctions_match = check_sanctions_list(db_request.aadhaar_number, db_request.pan_number)

    if sanctions_match:
        db_request.status = models.KYCStatus.FLAGGED
        db.commit()
        create_audit_log(db, db_request.id, "SANCTIONS_LIST_MATCH", "Customer details matched with sanctions list")
        return {"status": "FLAGGED", "reason": "Sanctions list match"}

    db_request.status = models.KYCStatus.APPROVED
    db.commit()
    create_audit_log(db, db_request.id, "KYC_APPROVED", "KYC process approved")
    return {"status": "APPROVED"}

