from sqlalchemy.orm import Session
from ..models.kyc import KYC, KYCStatus
from ..schemas.kyc import KYCCreate

def validate_aadhaar(aadhaar_number: str) -> bool:
    # In a real application, this would call the UIDAI API
    return True

def validate_pan(pan_number: str) -> bool:
    # In a real application, this would call the NSDL/ITD API
    return True

def check_sanctions_list(aadhaar_number: str, pan_number: str) -> bool:
    # In a real application, this would call the RBI sanctions list API
    return False

def create_kyc_record(db: Session, kyc: KYCCreate) -> KYC:
    db_kyc = KYC(**kyc.dict())
    db.add(db_kyc)
    db.commit()
    db.refresh(db_kyc)
    return db_kyc

def process_kyc(db: Session, kyc_id: int) -> KYC:
    db_kyc = db.query(KYC).filter(KYC.id == kyc_id).first()
    if not db_kyc:
        return None

    aadhaar_valid = validate_aadhaar(db_kyc.aadhaar_number)
    pan_valid = validate_pan(db_kyc.pan_number)
    sanctions_match = check_sanctions_list(db_kyc.aadhaar_number, db_kyc.pan_number)

    if aadhaar_valid and pan_valid and not sanctions_match:
        db_kyc.status = KYCStatus.APPROVED
    else:
        db_kyc.status = KYCStatus.FLAGGED

    db.commit()
    db.refresh(db_kyc)
    return db_kyc
