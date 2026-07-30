from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from server.database import get_db
from server.models import User
from server.schemas import UserResponse, UserUpdate
from server.auth import get_current_user, require_admin

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=List[UserResponse])
def list_users(
    db: Session = Depends(get_db), current_user: User = Depends(require_admin)
):
    return db.query(User).all()


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: UUID,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check if authorized (Admin or Owner)
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user.full_name = user_update.full_name
    user.address = user_update.address
    user.phone_number = user_update.phone_number

    # Only admin can change is_active status
    if current_user.role == "admin":
        user.is_active = user_update.is_active

    db.commit()
    db.refresh(user)
    return user
