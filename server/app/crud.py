from sqlalchemy.orm import Session
from . import models, schemas

def create_policy(db: Session, policy: schemas.PolicyCreate, calculated_premium: float):
    db_policy = models.Policy(
        customer_id=policy.customer_id,
        vehicle_make=policy.vehicle_make,
        vehicle_model=policy.vehicle_model,
        ncb_percentage=policy.ncb_percentage,
        vehicle_multiplier=policy.vehicle_multiplier,
        base_premium=500,  # as per requirement
        calculated_premium=calculated_premium
    )
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy
