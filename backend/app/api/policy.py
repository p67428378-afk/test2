
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from ..models.policy import Policy, PolicyHolder, PolicyChangeRequest, RequestType, PolicyStatus, RequestStatus
from ..schemas.policy import Policy as PolicySchema, PolicyUpdate, PolicyChangeRequest as PolicyChangeRequestSchema, PolicyHolder as PolicyHolderSchema
from ..database import get_db

router = APIRouter()

@router.get("/policyholders/{policyholder_id}", response_model=PolicyHolderSchema)
def read_policy_holder(policyholder_id: int, db: Session = Depends(get_db)):
    db_policy_holder = db.query(PolicyHolder).filter(PolicyHolder.id == policyholder_id).first()
    if db_policy_holder is None:
        raise HTTPException(status_code=404, detail="Policy holder not found")
    return db_policy_holder

@router.get("/policies/{policy_id}", response_model=PolicySchema)
def read_policy(policy_id: int, db: Session = Depends(get_db)):
    db_policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@router.put("/policies/{policy_id}", response_model=PolicySchema)
def update_policy(policy_id: int, policy: PolicyUpdate, db: Session = Depends(get_db)):
    db_policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    update_data = policy.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_policy, key, value)
    
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

@router.post("/policies/{policy_id}/cancel", response_model=PolicyChangeRequestSchema)
def cancel_policy(policy_id: int, db: Session = Depends(get_db)):
    db_policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")

    change_request = PolicyChangeRequest(
        policy_id=policy_id,
        request_type=RequestType.CANCEL,
        status=RequestStatus.PENDING,
        submission_date=date.today()
    )
    db.add(change_request)

    db_policy.status = PolicyStatus.PENDING
    db.add(db_policy)
    db.commit()
    db.refresh(change_request)

    return change_request
