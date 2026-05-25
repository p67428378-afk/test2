
from sqlalchemy.orm import Session
from kyc_onboarding.models.customer_kyc import CustomerKYC
from kyc_onboarding.schemas.kyc_schemas import KYCRequest

def create_kyc_record(db: Session, request: KYCRequest):
    db_kyc = CustomerKYC(
        customer_id=request.customer_id,
        aadhaar_number=request.aadhaar_number,
        pan_number=request.pan_number,
        aadhaar_validation_status="PENDING",
        pan_validation_status="PENDING",
        sanctions_screening_status="PENDING",
        final_kyc_status="PENDING",
    )
    db.add(db_kyc)
    db.commit()
    db.refresh(db_kyc)
    return db_kyc

def get_kyc_record(db: Session, kyc_id: str):
    return db.query(CustomerKYC).filter(CustomerKYC.kyc_id == kyc_id).first()
