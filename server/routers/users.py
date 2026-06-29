"""
Module: server.routers.users
Purpose: Users router.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.user import User
from server.routers.auth import get_current_user
from server.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/availability", response_model=UserResponse)
def update_availability(
    is_online: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update driver's availability (online/offline).
    """
    if current_user.role != "delivery":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only delivery partners can update availability",
        )

    current_user.is_online = is_online  # type: ignore
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
