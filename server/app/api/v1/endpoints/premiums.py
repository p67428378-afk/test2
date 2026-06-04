from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.crud import crud_policy
from app.schemas import policy as policy_schema
from app.api import deps

router = APIRouter()

@router.post("/calculate", response_model=policy_schema.Policy)
def calculate_premium(
    *, 
    db: Session = Depends(deps.get_db),
    policy_in: policy_schema.PolicyCreate
) -> policy_schema.Policy:
    """
    Calculate a new premium and save it to the database.
    """
    policy = crud_policy.policy.create(db=db, obj_in=policy_in)
    return policy
