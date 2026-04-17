from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas
from app.services import policy_service
from app.db.session import get_db

router = APIRouter()

@router.get("/{policy_id}", response_model=schemas.policy.Policy)
def read_policy(policy_id: uuid.UUID, db: Session = Depends(get_db)):
    db_policy = policy_service.get_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.get("/holder/{policy_holder_id}", response_model=List[schemas.policy.Policy])
def read_policies_by_holder(policy_holder_id: str, db: Session = Depends(get_db)):
    db_policies = policy_service.get_policies_by_holder(db, policy_holder_id=policy_holder_id)
    return db_policies

@router.post("/", response_model=schemas.policy.Policy)
def create_policy(policy: schemas.policy.PolicyCreate, db: Session = Depends(get_db)):
    return policy_service.create_policy(db=db, policy=policy)

@router.put("/{policy_id}", response_model=schemas.policy.Policy)
def update_policy(policy_id: uuid.UUID, policy: schemas.policy.PolicyUpdate, db: Session = Depends(get_db)):
    db_policy = policy_service.get_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy_service.update_policy(db=db, db_policy=db_policy, policy=policy)

@router.delete("/{policy_id}", response_model=schemas.policy.Policy)
def cancel_policy(policy_id: uuid.UUID, db: Session = Depends(get_db)):
    db_policy = policy_service.get_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy_service.cancel_policy(db=db, db_policy=db_policy)
