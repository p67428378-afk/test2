from sqlalchemy.orm import Session
from .. import models, schemas

class KycService:
    def _validate_aadhaar(self, aadhaar_number: str) -> bool:
        # Placeholder for real Aadhaar validation
        return aadhaar_number != "invalid"

    def _validate_pan(self, pan_number: str) -> bool:
        # Placeholder for real PAN validation
        return pan_number != "invalid"

    def _check_sanctions_list(self, full_name: str) -> bool:
        # Placeholder for real sanctions list check
        return full_name != "Sanctioned Person"

    def process_kyc(self, db: Session, kyc_request: schemas.KycRequest) -> schemas.KycResponse:
        # 1. Create Customer
        customer = models.kyc.Customer(full_name=kyc_request.full_name)
        db.add(customer)
        db.commit()
        db.refresh(customer)

        # 2. Create Audit Trail
        db.add(models.kyc.AuditTrail(customer_id=customer.id, activity="KYC process started"))
        db.commit()

        # 3. Validate Documents
        aadhaar_valid = self._validate_aadhaar(kyc_request.aadhaar_number)
        pan_valid = self._validate_pan(kyc_request.pan_number)

        if not aadhaar_valid:
            customer.status = schemas.KycStatus.FLAGGED
            db.add(models.kyc.AuditTrail(customer_id=customer.id, activity="Aadhaar validation failed"))
            db.commit()
            return schemas.KycResponse(customer_id=customer.id, status=customer.status, message="Aadhaar validation failed")

        if not pan_valid:
            customer.status = schemas.KycStatus.FLAGGED
            db.add(models.kyc.AuditTrail(customer_id=customer.id, activity="PAN validation failed"))
            db.commit()
            return schemas.KycResponse(customer_id=customer.id, status=customer.status, message="PAN validation failed")

        # 4. Check Sanctions List
        is_sanctioned = not self._check_sanctions_list(kyc_request.full_name)
        if is_sanctioned:
            customer.status = schemas.KycStatus.FLAGGED
            db.add(models.kyc.AuditTrail(customer_id=customer.id, activity="Customer is on the sanctions list"))
            db.commit()
            return schemas.KycResponse(customer_id=customer.id, status=customer.status, message="Customer is on the sanctions list")

        # 5. Approve KYC
        customer.status = schemas.KycStatus.APPROVED
        db.add(models.kyc.AuditTrail(customer_id=customer.id, activity="KYC process completed successfully"))
        db.commit()

        return schemas.KycResponse(customer_id=customer.id, status=customer.status, message="KYC process completed successfully.")

kyc_service = KycService()
