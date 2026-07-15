from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import User, VisitorProfile, SecurityFlag
from server.schemas import SecurityFlagCreate, SecurityFlagResponse
from server.auth import require_role

router = APIRouter()


@router.post("/flag", response_model=SecurityFlagResponse)
def flag_visitor(
    payload: SecurityFlagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["security"])),
):
    # Get visitor profile
    profile = (
        db.query(VisitorProfile).filter(VisitorProfile.id == payload.visitor_id).first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Visitor profile not found")

    # Flag the visitor
    profile.is_flagged = True

    # Create security flag entry
    new_flag = SecurityFlag(
        visitor_id=profile.id, reason=payload.reason, flagged_by=current_user.id
    )
    db.add(new_flag)
    db.commit()
    db.refresh(new_flag)

    return SecurityFlagResponse(
        id=new_flag.id,
        visitor_id=new_flag.visitor_id,
        reason=new_flag.reason,
        is_active=True,
    )
