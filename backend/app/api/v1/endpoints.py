from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import schemas
from ...services import policy_service
from ...database import get_db

router = APIRouter()

@router.post("/policy_holders/", response_model=schemas.PolicyHolder)
def create_policy_holder(policy_holder: schemas.PolicyHolderCreate, db: Session = Depends(get_db)):
    db_policy_holder = policy_service.get_policy_holder_by_email(db, email=policy_holder.email)
    if db_policy_holder:
        raise HTTPException(status_code=400, detail="Email already registered")
    return policy_service.create_policy_holder(db=db, policy_holder=policy_holder)

@router.get("/policy_holders/", response_model=List[schemas.PolicyHolder])
def read_policy_holders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    policy_holders = policy_service.get_policy_holders(db, skip=skip, limit=limit)
    return policy_holders

@router.get("/policy_holders/{user_id}", response_model=schemas.PolicyHolder)
def read_policy_holder(user_id: str, db: Session = Depends(get_db)):
    db_policy_holder = policy_service.get_policy_holder(db, user_id=user_id)
    if db_policy_holder is None:
        raise HTTPException(status_code=404, detail="Policy holder not found")
    return db_policy_holder

@router.put("/policy_holders/{user_id}", response_model=schemas.PolicyHolder)
def update_policy_holder(user_id: str, policy_holder: schemas.PolicyHolderUpdate, db: Session = Depends(get_db)):
    return policy_service.update_policy_holder(db=db, user_id=user_id, policy_holder=policy_holder)

@router.delete("/policy_holders/{user_id}")
def delete_policy_holder(user_id: str, db: Session = Depends(get_db)):
    return policy_service.delete_policy_holder(db=db, user_id=user_id)

@router.post("/policy_holders/{user_id}/policies/", response_model=schemas.Policy)
def create_policy_for_policy_holder(
    user_id: str, policy: schemas.PolicyCreate, db: Session = Depends(get_db)
):
    db_policy_holder = policy_service.get_policy_holder(db, user_id=user_id)
    if db_policy_holder is None:
        raise HTTPException(status_code=404, detail="Policy holder not found")
    return policy_service.create_policy(db=db, policy=policy, user_id=user_id)

@router.get("/policy_holders/{user_id}/policies/", response_model=List[schemas.Policy])
def read_policy_holder_policies(user_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    policies = policy_service.get_policy_holder_policies(db, user_id=user_id, skip=skip, limit=limit)
    if not policies:
        raise HTTPException(status_code=404, detail="Policies not found for this policy holder")
    return policies

@router.get("/policies/{policy_id}", response_model=schemas.Policy)
def read_policy(policy_id: str, db: Session = Depends(get_db)):
    db_policy = policy_service.get_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.put("/policies/{policy_id}", response_model=schemas.Policy)
def update_policy(policy_id: str, policy: schemas.PolicyUpdate, db: Session = Depends(get_db)):
    return policy_service.update_policy(db=db, policy_id=policy_id, policy=policy)

@router.delete("/policies/{policy_id}")
def delete_policy(policy_id: str, db: Session = Depends(get_db)):
    return policy_service.delete_policy(db=db, policy_id=policy_id)
