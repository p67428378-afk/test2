from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.registration import Registration
from server.models.conference import Conference
from server.models.user import User
from server.schemas.registration import RegistrationCreate, RegistrationResponse
from server.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/v1/registrations", tags=["registrations"])


@router.post(
    "", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED
)
@router.post(
    "/", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED
)
def register_conference(
    reg_in: RegistrationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conf = db.query(Conference).filter(Conference.id == reg_in.conference_id).first()
    if not conf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conference not found",
        )

    # Check existing registration
    existing = (
        db.query(Registration)
        .filter(
            Registration.conference_id == reg_in.conference_id,
            Registration.attendee_id == current_user.id,
        )
        .first()
    )
    if existing:
        return existing

    reg = Registration(
        conference_id=reg_in.conference_id,
        attendee_id=current_user.id,
        ticket_type=reg_in.ticket_type or "STANDARD",
        status="CONFIRMED",
    )
    db.add(reg)
    db.commit()
    db.refresh(reg)
    return reg


@router.get("/user/{user_id}", response_model=List[RegistrationResponse])
def get_user_registrations(user_id: str, db: Session = Depends(get_db)):
    regs = db.query(Registration).filter(Registration.attendee_id == user_id).all()
    return regs


@router.get("", response_model=List[RegistrationResponse])
@router.get("/", response_model=List[RegistrationResponse])
def list_registrations(
    conference_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Registration)
    if conference_id:
        query = query.filter(Registration.conference_id == conference_id)
    return query.all()
