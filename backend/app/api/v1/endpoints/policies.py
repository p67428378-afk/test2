from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas
from app.services import policy_service
from app.api.v1.deps import get_db

router = APIRouter()

@router.post("/", response_model=schemas.policy.Policy)
def create_policy(policy: schemas.policy.PolicyCreate, db: Session = Depends(get_db)):
    # A placeholder policy_holder_id is used here. In a real application,
    # this would come from the authenticated user.
    return policy_service.create_policy(db=db, policy=policy, policy_holder_id=1)

@router.get("/", response_model=List[schemas.policy.Policy])
def read_policies(
    db: Session = Depends(get_db), skip: int = 0, limit: int = 100
):
    policies = policy_service.get_policies(db, skip=skip, limit=limit)
    return policies

@router.get("/{policy_id}", response_model=schemas.policy.Policy)
def read_policy(policy_id: int, db: Session = Depends(get_db)):
    db_policy = policy_service.get_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.put("/{policy_id}", response_model=schemas.policy.Policy)
def update_policy(
    policy_id: int, policy: schemas.policy.PolicyUpdate, db: Session = Depends(get_db)
):
    db_policy = policy_service.update_policy(db, policy_id=policy_id, policy=policy)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.delete("/{policy_id}", response_model=schemas.policy.Policy)
def delete_policy(policy_id: int, db: Session = Depends(get_db)):
    db_policy = policy_service.delete_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy
