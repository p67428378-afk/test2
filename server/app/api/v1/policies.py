from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.app import crud, schemas
from server.app.database import get_db

router = APIRouter()

@router.post("/policies", response_model=schemas.PolicyResponse)
def create_policy_and_calculate_premium(
    policy: schemas.PolicyCreate, db: Session = Depends(get_db)
):
    base_premium = 500
    premium_after_ncb = base_premium * (1 - policy.ncb_percentage / 100)
    calculated_premium = premium_after_ncb * policy.vehicle_multiplier

    created_policy = crud.create_policy(db=db, policy=policy, calculated_premium=calculated_premium)
    return created_policy
