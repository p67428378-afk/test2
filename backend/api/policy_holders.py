from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.schemas.policy import PolicyHolder, PolicyHolderCreate
from backend.core import crud
from backend.database import get_db

router = APIRouter()

@router.post("/policy-holders/", response_model=PolicyHolder)
def create_policy_holder(policy_holder: PolicyHolderCreate, db: Session = Depends(get_db)):
    db_policy_holder = crud.get_policy_holder_by_email(db, email=policy_holder.email)
    if db_policy_holder:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_policy_holder(db=db, policy_holder=policy_holder)
