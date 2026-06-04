from sqlalchemy.orm import Session
from app.models.policy import Policy
from app.schemas.policy import PolicyCreate
from app.services.premium_calculator import PremiumCalculator

class CRUDPolicy:
    def __init__(self, calculator: PremiumCalculator):
        self.calculator = calculator

    def create(self, db: Session, *, obj_in: PolicyCreate) -> Policy:
        final_premium = self.calculator.calculate(
            base_rate=obj_in.base_rate,
            ncb_percentage=obj_in.ncb_percentage,
            vehicle_multiplier=obj_in.vehicle_multiplier
        )
        db_obj = Policy(
            base_rate=obj_in.base_rate,
            ncb_percentage=obj_in.ncb_percentage,
            vehicle_multiplier=obj_in.vehicle_multiplier,
            final_premium=final_premium
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

policy = CRUDPolicy(calculator=PremiumCalculator())
