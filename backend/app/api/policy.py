from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db import database
from app.schemas import policy as policy_schema
from app.services import policy as policy_service

router = APIRouter()

@router.get("/policies/", response_model=List[policy_schema.Policy])
def read_policies(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    policies = policy_service.get_policies(db, skip=skip, limit=limit)
    return policies

@router.post("/policies/", response_model=policy_schema.Policy)

def create_policy(policy: policy_schema.PolicyCreate, db: Session = Depends(database.get_db)):
    return policy_service.create_policy(db=db, policy=policy)

@router.get("/policies/{policy_id}", response_model=policy_schema.Policy)

def read_policy(policy_id: int, db: Session = Depends(database.get_db)):
    db_policy = policy_service.get_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.put("/policies/{policy_id}", response_model=policy_schema.Policy)

def update_policy(policy_id: int, policy: policy_schema.PolicyUpdate, db: Session = Depends(database.get_db)):
    db_policy = policy_service.update_policy(db, policy_id=policy_id, policy=policy)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.delete("/policies/{policy_id}", response_model=policy_schema.Policy)

def delete_policy(policy_id: int, db: Session = Depends(database.get_db)):
    db_policy = policy_service.delete_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy
