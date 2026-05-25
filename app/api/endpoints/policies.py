from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import crud, models, schemas
from app.database import get_db

router = APIRouter()

@router.get("/policies/{policy_id}", response_model=schemas.Policy)
def read_policy(policy_id: int, db: Session = Depends(get_db)):
    db_policy = crud.get_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.put("/policies/{policy_id}", response_model=schemas.Policy)
def update_policy(policy_id: int, policy_update: schemas.PolicyUpdate, db: Session = Depends(get_db)):
    db_policy = crud.update_policy(db, policy_id=policy_id, policy_update=policy_update)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.delete("/policies/{policy_id}/cancel", response_model=schemas.Policy)
def cancel_policy(policy_id: int, db: Session = Depends(get_db)):
    db_policy = crud.cancel_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy
