
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.app.db.session import get_db
from server.app.crud import crud_policy
from server.app.schemas.policy import PolicyCreate, Policy

router = APIRouter()

@router.post("/", response_model=Policy)
def create_policy(policy: PolicyCreate, db: Session = Depends(get_db)):
    return crud_policy.create_policy(db=db, policy=policy)

@router.get("/{policy_id}", response_model=Policy)
def read_policy(policy_id: str, db: Session = Depends(get_db)):
    return crud_policy.get_policy(db=db, policy_id=policy_id)
