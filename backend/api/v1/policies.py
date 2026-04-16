
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend import crud, schemas
from backend.database import get_db

router = APIRouter()


@router.get("/{policy_id}", response_model=schemas.Policy)
def read_policy(policy_id: str):
    # In a real application, this would fetch data from the existing policy management system.
    # For this example, we return a mock policy.
    if policy_id == "policy-123":
        return {
            "policy_id": "policy-123",
            "policy_holder_id": "user-abc",
            "policy_type": "Gold Plan",
            "effective_date": "2024-01-01T00:00:00",
            "expiration_date": "2024-12-31T23:59:59",
            "premium_amount": 500.0,
            "status": "Active",
            "beneficiaries": ["Spouse"]
        }
    raise HTTPException(status_code=404, detail="Policy not found")


@router.post("/requests/", response_model=schemas.PolicyChangeRequest)
def create_policy_change_request(request: schemas.PolicyChangeRequestCreate, db: Session = Depends(get_db)):
    return crud.create_policy_change_request(db=db, request=request)


@router.get("/{policy_id}/requests/", response_model=List[schemas.PolicyChangeRequest])
def read_policy_change_requests(policy_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    requests = crud.get_policy_change_requests_by_policy(db, policy_id=policy_id, skip=skip, limit=limit)
    return requests
