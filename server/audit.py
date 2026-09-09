import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from server.models import AuditLog


def log_audit_event(
    db: Session,
    action: str,
    resource: str,
    status_code: int,
    ip_address: str,
    user_id: Optional[str] = None,
    user_email: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None,
) -> AuditLog:
    """
    Appends an immutable audit log entry.
    """
    try:
        audit_entry = AuditLog(
            id=str(uuid.uuid4()),
            user_id=user_id,
            user_email=user_email,
            action=action,
            resource=resource,
            status_code=status_code,
            ip_address=ip_address,
            details=details or {},
            timestamp=datetime.now(timezone.utc),
        )
        db.add(audit_entry)
        db.commit()
        db.refresh(audit_entry)
        return audit_entry
    except Exception as e:
        db.rollback()
        # Fallback print if db logging fails
        print(f"[AUDIT LOGGING ERROR] Failed to write audit log: {e}")
        return None
