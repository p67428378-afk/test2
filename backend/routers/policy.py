from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import schemas
from ..services import policy_service
from ..database import get_db

router = APIRouter()

@router.get("/policy/{policy_id}", response_model=schemas.PolicyResponse)
def get_policy_details(policy_id: str, db: Session = Depends(get_db)):
    policy = policy_service.get_policy(db, policy_id)
    return policy

@router.put("/policy/{policy_id}/coverage", response_model=schemas.PolicyResponse)
def update_coverage_options(policy_id: str, coverage_update: schemas.CoverageOptionUpdate, db: Session = Depends(get_db)):
    policy = policy_service.update_policy_coverage(db, policy_id, coverage_update)
    return policy

@router.delete("/policy/{policy_id}", response_model=schemas.PolicyResponse)
def cancel_policy(policy_id: str, db: Session = Depends(get_db)):
    policy = policy_service.cancel_policy(db, policy_id)
    return policy
