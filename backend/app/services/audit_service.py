import hashlib
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session

from backend.app import models, schemas

def create_audit_log(db: Session, audit_log: schemas.AuditLogCreate):
    current_timestamp = datetime.now()
    data_to_hash = f"{audit_log.event_type}-{current_timestamp}-{audit_log.entity_id}-{audit_log.old_state}-{audit_log.new_state}-{audit_log.actor}-{audit_log.context}"
    hash_signature = hashlib.sha256(data_to_hash.encode()).hexdigest()

    db_audit_log = models.AuditLog(
        loan_id=audit_log.loan_id,
        event_type=audit_log.event_type,
        timestamp=current_timestamp,
        entity_id=audit_log.entity_id,
        old_state=audit_log.old_state,
        new_state=audit_log.new_state,
        actor=audit_log.actor,
        context=audit_log.context,
        hash_signature=hash_signature
    )
    db.add(db_audit_log)
    db.commit()
    db.refresh(db_audit_log)
    return db_audit_log

def get_audit_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.AuditLog).offset(skip).limit(limit).all()

def get_audit_logs_for_loan(db: Session, loan_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.AuditLog).filter(models.AuditLog.loan_id == loan_id).offset(skip).limit(limit).all()
