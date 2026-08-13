from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from server.database import get_db
from server.models.user import User, UserRole
from server.schemas.user import UserResponse
from server.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserResponse])
def list_users(
    role_filter: Optional[UserRole] = Query(None, alias="role"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(User)
    if role_filter:
        query = query.filter(User.role == role_filter)
    return query.all()
