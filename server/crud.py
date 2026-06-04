from sqlalchemy.orm import Session
from server import models, schemas

def create_policy(db: Session, policy: schemas.PremiumCalculationResponse, request: schemas.PremiumCalculationRequest):
    db_policy = models.Policy(
        id=policy.policy_id,
        base_premium=policy.base_premium,
        ncb_percentage=get_ncb_percentage(request.ncb_years),
        vehicle_multiplier=request.vehicle_type_multiplier,
        final_premium=policy.final_premium
    )
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def get_ncb_percentage(ncb_years: int) -> float:
    if ncb_years < 1:
        return 0.0
    elif ncb_years == 1:
        return 0.20
    elif ncb_years == 2:
        return 0.25
    elif ncb_years == 3:
        return 0.35
    elif ncb_years == 4:
        return 0.45
    else:
        return 0.50
