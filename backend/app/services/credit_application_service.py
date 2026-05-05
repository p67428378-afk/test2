from sqlalchemy.orm import Session
from app.models.credit_application import CreditApplication, ApplicationStatus
from app.schemas.credit_application import CreditApplicationCreate

class CreditApplicationService:
    def create_application(self, db: Session, application: CreditApplicationCreate) -> CreditApplication:
        db_application = CreditApplication(**application.dict())
        db.add(db_application)
        db.commit()
        db.refresh(db_application)
        return db_application

    def get_application(self, db: Session, application_id: int) -> CreditApplication:
        return db.query(CreditApplication).filter(CreditApplication.id == application_id).first()

    def get_credit_card_tiers(self, credit_score: int):
        # In a real application, this would involve complex business logic
        # and potentially calls to other services or databases.
        if credit_score >= 720:
            return [
                {"name": "Platinum Card", "apr": 15.0, "credit_limit": 10000, "rewards_program": "2% Cashback"},
                {"name": "Gold Card", "apr": 18.0, "credit_limit": 5000, "rewards_program": "1% Cashback"}
            ]
        elif 680 <= credit_score < 720:
            return [
                {"name": "Gold Card", "apr": 18.0, "credit_limit": 5000, "rewards_program": "1% Cashback"},
                {"name": "Silver Card", "apr": 22.0, "credit_limit": 2500, "rewards_program": "0.5% Cashback"}
            ]
        else:
            return [
                {"name": "Silver Card", "apr": 22.0, "credit_limit": 2500, "rewards_program": "0.5% Cashback"}
            ]

    def select_tier(self, db: Session, application_id: int, selected_tier: str) -> CreditApplication:
        db_application = self.get_application(db, application_id)
        if db_application:
            db_application.selected_credit_card_tier = selected_tier
            db_application.status = ApplicationStatus.IN_REVIEW
            db.commit()
            db.refresh(db_application)
        return db_application

credit_application_service = CreditApplicationService()
