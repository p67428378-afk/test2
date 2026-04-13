
from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate

class KYCService:
    def onboard_customer(self, db: Session, customer: CustomerCreate) -> Customer:
        db_customer = Customer(
            aadhaar_number=customer.aadhaar_number,
            pan_number=customer.pan_number,
        )
        db.add(db_customer)
        db.commit()
        db.refresh(db_customer)
        return db_customer

kyc_service = KYCService()
