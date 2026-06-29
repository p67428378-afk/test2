from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.post(
    "/memberships",
    response_model=schemas.MembershipResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user_membership(
    request: schemas.MembershipCreateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    membership = crud.create_membership(
        db,
        user_id=current_user.id,
        gym_name=request.gym_name,
        membership_type=request.membership_type,
        monthly_fee=request.monthly_fee,
    )
    return membership


@router.get("/memberships", response_model=List[schemas.MembershipResponse])
def read_user_memberships(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Fetch memberships with pagination
    memberships = (
        db.query(models.Membership)
        .filter(models.Membership.user_id == current_user.id)
        .order_by(models.Membership.created_at)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return memberships
