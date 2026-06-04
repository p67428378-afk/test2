
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.schemas.policy import PolicyCreate, Policy
from server.db.session import SessionLocal
from server.models.policy import Policy as PolicyModel

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

@router.post("/calculate", response_model=Policy)
def calculate_premium(policy: PolicyCreate, db: Session = Depends(get_db)):
    try:
        multiplied = policy.base_rate * policy.vehicle_multiplier
        discount = multiplied * (policy.ncb_percentage / 100)
        calculated_premium = multiplied - discount

        db_policy = PolicyModel(
            base_rate=policy.base_rate,
            ncb_percentage=policy.ncb_percentage,
            vehicle_multiplier=policy.vehicle_multiplier,
            calculated_premium=calculated_premium
        )
        db.add(db_policy)
        db.commit()
        db.refresh(db_policy)
        return db_policy
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
