import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from server.models.audit import AuditLog


class AuditService:
    @staticmethod
    def log_change(
        table_name: str,
        record_id: str,
        operation: str,
        changed_by: str,
        old_data: dict = None,
        new_data: dict = None,
        db: Session = None,
    ) -> AuditLog:
        if not db:
            return None

        audit_log = AuditLog(
            log_id=str(uuid.uuid4()),
            table_name=table_name,
            record_id=record_id,
            operation=operation,
            changed_by=changed_by,
            changed_at=datetime.now(timezone.utc),
            old_data=old_data,
            new_data=new_data,
        )

        db.add(audit_log)
        db.commit()
        db.refresh(audit_log)
        return audit_log
