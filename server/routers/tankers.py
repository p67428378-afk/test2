from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from server.database import get_db
from server.models.user import User, UserRole
from server.models.tanker import Tanker, TankerStatus
from server.schemas.tanker import TankerCreate, TankerResponse
from server.auth import require_roles, get_current_user

router = APIRouter(prefix="/tankers", tags=["Tankers"])


@router.get("", response_model=List[TankerResponse])
def list_tankers(
    status_filter: Optional[TankerStatus] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Tanker)
    if status_filter:
        query = query.filter(Tanker.status == status_filter)
    return query.all()


@router.post("", response_model=TankerResponse, status_code=status.HTTP_201_CREATED)
def create_tanker(
    tanker_in: TankerCreate,
    current_user: User = Depends(require_roles(UserRole.OPERATOR, UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    existing = (
        db.query(Tanker)
        .filter(Tanker.registration_number == tanker_in.registration_number)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration number already exists",
        )
    tanker = Tanker(
        registration_number=tanker_in.registration_number,
        capacity_liters=tanker_in.capacity_liters,
        status=tanker_in.status or TankerStatus.AVAILABLE,
    )
    db.add(tanker)
    db.commit()
    db.refresh(tanker)
    return tanker
