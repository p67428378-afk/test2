from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User
from server.schemas import (
    UserResponse,
    UserRoleUpdateRequest,
    RBACMatrixResponse,
    RoleCapability,
)
from server.rbac import (
    require_roles,
    ROLE_ADMIN,
    ALL_ROLES,
    RBAC_CAPABILITIES_MATRIX,
)
from server.auth import get_current_user
from server.audit import log_audit_event

router = APIRouter(prefix="/api/v1/rbac", tags=["Role-Based Access Control"])


@router.get("/roles", response_model=RBACMatrixResponse)
def get_rbac_roles_matrix(current_user: User = Depends(get_current_user)):
    capabilities = [RoleCapability(**cap) for cap in RBAC_CAPABILITIES_MATRIX]
    return RBACMatrixResponse(
        roles=ALL_ROLES,
        capabilities=capabilities,
    )


@router.get("/users", response_model=List[UserResponse])
def list_users_roles(
    current_user: User = Depends(require_roles([ROLE_ADMIN])),
    db: Session = Depends(get_db),
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [UserResponse.model_validate(u) for u in users]


@router.put("/users/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: str,
    role_in: UserRoleUpdateRequest,
    request: Request,
    current_user: User = Depends(require_roles([ROLE_ADMIN])),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"

    if role_in.role not in ALL_ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role '{role_in.role}'. Allowed roles: {ALL_ROLES}",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User ID '{user_id}' not found",
        )

    old_role = user.role
    user.role = role_in.role
    user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="RBAC_ROLE_CHANGE",
        resource=f"/users/{user.id}/role",
        status_code=200,
        ip_address=client_ip,
        details={
            "target_user_email": user.email,
            "old_role": old_role,
            "new_role": user.role,
        },
    )

    return UserResponse.model_validate(user)
