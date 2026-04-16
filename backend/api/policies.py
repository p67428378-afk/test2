from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.schemas.policy import Policy, PolicyCreate, PolicyUpdate
from backend.core import crud
from backend.database import get_db

router = APIRouter()

@router.post("/policy-holders/{policy_holder_id}/policies/", response_model=Policy)
def create_policy_for_policy_holder(
    policy_holder_id: int, policy: PolicyCreate, db: Session = Depends(get_db)
):
    return crud.create_policy(db=db, policy=policy, policy_holder_id=policy_holder_id)

@router.get("/policies/{policy_id}", response_model=Policy)
def read_policy(policy_id: int, db: Session = Depends(get_db)):
    db_policy = crud.get_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.put("/policies/{policy_id}", response_model=Policy)
def update_policy(policy_id: int, policy: PolicyUpdate, db: Session = Depends(get_db)):
    db_policy = crud.update_policy(db, policy_id=policy_id, policy=policy)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.delete("/policies/{policy_id}", response_model=Policy)
def delete_policy(policy_id: int, db: Session = Depends(get_db)):
    db_policy = crud.delete_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy
