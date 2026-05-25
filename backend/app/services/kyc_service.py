from sqlalchemy.orm import Session
from app.db.models import KYCAudit, KYCStatus
from app.schemas.kyc import KYCCreate

class KYCService:
    def __init__(self, db: Session):
        self.db = db

    def create_kyc_record(self, kyc: KYCCreate) -> KYCAudit:
        db_kyc = KYCAudit(
            aadhaar_number=kyc.aadhaar_number,
            pan_number=kyc.pan_number,
            status=KYCStatus.PENDING
        )
        self.db.add(db_kyc)
        self.db.commit()
        self.db.refresh(db_kyc)
        return db_kyc
