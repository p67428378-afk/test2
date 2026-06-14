from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional

from server.database import get_db
from server import models, schemas, crud
from server.api.v1.endpoints.accounts import get_current_user

router = APIRouter()

@router.get("/audit/logs", response_model=schemas.AuditLogsResponse)
def get_audit_logs(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    logs = crud.get_audit_logs_by_user(db, user_id=str(current_user.id), skip=skip, limit=limit)
    
    log_items = []
    for log in logs:
        log_items.append(
            schemas.AuditLogItem(
                accountId=str(log.account_id),
                details=log.details,
                eventType=log.event_type,
                id=str(log.id),
                timestamp=log.timestamp.isoformat(),
                userId=str(log.user_id)
            )
        )
        
    return schemas.AuditLogsResponse(logs=log_items)
