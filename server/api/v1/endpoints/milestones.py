from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from server.database import get_db
from server import models, schemas, crud
from server.api.v1.endpoints.users import get_current_user
from decimal import Decimal

router = APIRouter(prefix="/milestones", tags=["milestones"])


@router.get("", response_model=schemas.MilestoneProgressResponse)
def get_milestones(
    current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    # Total roundup amount (sum of all roundups from transactions with status 'Invested')
    total_roundup = db.query(func.sum(models.Transaction.roundup_amount)).filter(
        models.Transaction.user_id == current_user.id
    ).filter(models.Transaction.status == "Invested").scalar() or Decimal("0.00")

    # Get user milestones
    milestones = crud.get_user_milestones(db, str(current_user.id))
    if not milestones:
        milestones = crud.create_default_milestones(db, str(current_user.id))

    return schemas.MilestoneProgressResponse(
        total_invested=float(total_roundup), milestones=milestones
    )
