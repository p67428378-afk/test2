from typing import Optional
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server.models import User, AuditLog
from server.schemas import AuditLogResponse, AuditLogListResponse
from server.rbac import (
    require_roles,
    ROLE_ADMIN,
    ROLE_LEAD_INVESTIGATOR,
    ROLE_AUDITOR,
)

router = APIRouter(prefix="/api/v1/audit-logs", tags=["Audit Logging"])


@router.get("", response_model=AuditLogListResponse)
def list_audit_logs(
    request: Request,
    action: Optional[str] = None,
    user_email: Optional[str] = None,
    resource: Optional[str] = None,
    status_code: Optional[int] = None,
    query: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(
        require_roles([ROLE_ADMIN, ROLE_LEAD_INVESTIGATOR, ROLE_AUDITOR])
    ),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"
    q = db.query(AuditLog)

    if action:
        q = q.filter(AuditLog.action.ilike(f"%{action}%"))
    if user_email:
        q = q.filter(AuditLog.user_email.ilike(f"%{user_email}%"))
    if resource:
        q = q.filter(AuditLog.resource.ilike(f"%{resource}%"))
    if status_code is not None:
        q = q.filter(AuditLog.status_code == status_code)
    if query:
        search_filter = or_(
            AuditLog.action.ilike(f"%{query}%"),
            AuditLog.user_email.ilike(f"%{query}%"),
            AuditLog.resource.ilike(f"%{query}%"),
            AuditLog.ip_address.ilike(f"%{query}%"),
        )
        q = q.filter(search_filter)

    total = q.count()
    logs = q.order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()

    # Note: avoid infinite recursive audit logging on audit log reads by passing a quiet flag or simple entry
    return AuditLogListResponse(
        total=total,
        items=[AuditLogResponse.model_validate(log) for log in logs],
    )
