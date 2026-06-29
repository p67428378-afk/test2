from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.post(
    "/visits", response_model=schemas.VisitResponse, status_code=status.HTTP_201_CREATED
)
def create_user_visit(
    request: schemas.VisitCreateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Verify membership exists and belongs to current user
    membership = crud.get_membership_by_id(db, membership_id=request.membership_id)
    if not membership or membership.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Membership not found"
        )

    visit = crud.create_visit(
        db, membership_id=request.membership_id, visit_date=request.visit_date
    )
    return visit


@router.get("/visits", response_model=List[schemas.VisitResponse])
def read_user_visits(
    membership_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Build query with pagination
    query = (
        db.query(models.Visit)
        .join(models.Membership)
        .filter(models.Membership.user_id == current_user.id)
    )
    if membership_id:
        query = query.filter(models.Visit.membership_id == membership_id)

    visits = (
        query.order_by(models.Visit.visit_date.desc()).offset(skip).limit(limit).all()
    )
    return visits
