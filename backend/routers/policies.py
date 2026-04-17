
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import schemas
from backend.database import get_db
from backend.services import policy_service

router = APIRouter()

@router.post("/policy-holders", response_model=schemas.PolicyHolder)
def create_policy_holder(policy_holder: schemas.PolicyHolderCreate, db: Session = Depends(get_db)):
    return policy_service.create_policy_holder(db=db, policy_holder=policy_holder)

@router.get("/policy-holders/{policy_holder_id}", response_model=schemas.PolicyHolder)
def get_policy_holder(policy_holder_id: str, db: Session = Depends(get_db)):
    db_policy_holder = policy_service.get_policy_holder(db, policy_holder_id=policy_holder_id)
    if db_policy_holder is None:
        raise HTTPException(status_code=404, detail="Policy holder not found")
    return db_policy_holder

@router.post("/policy-holders/{policy_holder_id}/policies", response_model=schemas.Policy)
def create_policy_for_holder(
    policy_holder_id: str, policy: schemas.PolicyCreate, db: Session = Depends(get_db)
):
    db_policy_holder = policy_service.get_policy_holder(db, policy_holder_id=policy_holder_id)
    if db_policy_holder is None:
        raise HTTPException(status_code=404, detail="Policy holder not found")
    return policy_service.create_policy(db=db, policy=policy, policy_holder_id=policy_holder_id)

@router.get("/policies/{policy_id}", response_model=schemas.Policy)
def get_policy(policy_id: str, db: Session = Depends(get_db)):
    db_policy = policy_service.get_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.put("/policy-holders/{policy_holder_id}", response_model=schemas.PolicyHolder)
def update_policy_holder(
    policy_holder_id: str, policy_update: schemas.PolicyUpdate, db: Session = Depends(get_db)
):
    db_policy_holder = policy_service.update_policy_holder(
        db, policy_holder_id=policy_holder_id, policy_update=policy_update
    )
    if db_policy_holder is None:
        raise HTTPException(status_code=404, detail="Policy holder not found")
    return db_policy_holder

@router.put("/policies/{policy_id}/cancel", response_model=schemas.Policy)
def cancel_policy(policy_id: str, db: Session = Depends(get_db)):
    db_policy = policy_service.cancel_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy
