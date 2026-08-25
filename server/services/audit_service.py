from typing import Optional, List
from sqlalchemy.orm import Session
from server.models import AuditLog


def create_log(
    db: Session,
    fine_id: Optional[str],
    actor_id: str,
    action: str,
    notes: Optional[str] = None,
) -> AuditLog:
    log_entry = AuditLog(
        fine_id=fine_id,
        actor_id=actor_id,
        action=action,
        notes=notes,
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry


def get_audit_logs(
    db: Session,
    fine_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[AuditLog]:
    query = db.query(AuditLog)
    if fine_id:
        query = query.filter(AuditLog.fine_id == fine_id)
    return query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
