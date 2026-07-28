from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from server.database import get_db
from server.models import AuditLog, ChainOfCustodyLog, User, Evidence
from server.schemas import AuditLogResponse, ChainOfCustodyResponse
from server.auth import get_current_user, RoleChecker

router = APIRouter(tags=["audit"])


@router.get("/audit-log", response_model=List[AuditLogResponse])
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker(["Administrator"])),
):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()

    result = []
    for log in logs:
        user = (
            db.query(User).filter(User.id == log.user_id).first()
            if log.user_id
            else None
        )
        username = user.username if user else None
        result.append(
            {
                "id": log.id,
                "user_id": log.user_id,
                "username": username,
                "action": log.action,
                "details": log.details,
                "timestamp": log.timestamp,
            }
        )

    return result


@router.get(
    "/chain-of-custody/{evidence_id}", response_model=List[ChainOfCustodyResponse]
)
def get_chain_of_custody(
    evidence_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify evidence exists
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Evidence not found"
        )

    logs = (
        db.query(ChainOfCustodyLog)
        .filter(ChainOfCustodyLog.evidence_id == evidence_id)
        .order_by(ChainOfCustodyLog.timestamp.asc())
        .all()
    )

    result = []
    for log in logs:
        user = db.query(User).filter(User.id == log.user_id).first()
        username = user.username if user else "Unknown"
        result.append(
            {
                "id": log.id,
                "evidence_id": log.evidence_id,
                "user_id": log.user_id,
                "username": username,
                "action": log.action,
                "details": log.details,
                "timestamp": log.timestamp,
            }
        )

    return result
