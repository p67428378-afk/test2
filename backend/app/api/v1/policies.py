from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import SessionLocal
from app.schemas.policy import Policy, PolicyCreate, PolicyUpdate
from app.services import policy_service

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=Policy)
def create_policy(policy: PolicyCreate, db: Session = Depends(get_db)):
    return policy_service.create_policy(db=db, policy=policy)

@router.get("/{policy_id}", response_model=Policy)
def read_policy(policy_id: str, db: Session = Depends(get_db)):
    db_policy = policy_service.get_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.get("/", response_model=List[Policy])
def read_policies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    policies = policy_service.get_policies(db, skip=skip, limit=limit)
    return policies

@router.put("/{policy_id}", response_model=Policy)
def update_policy(policy_id: str, policy: PolicyUpdate, db: Session = Depends(get_db)):
    db_policy = policy_service.update_policy(db, policy_id=policy_id, policy=policy)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.delete("/{policy_id}", response_model=Policy)
def delete_policy(policy_id: str, db: Session = Depends(get_db)):
    db_policy = policy_service.delete_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy
