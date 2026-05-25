from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app import schemas
from backend.app.database import get_db
from backend.app.services import audit_service

router = APIRouter()

@router.post("/", response_model=schemas.AuditLog)
def create_audit_log(audit_log: schemas.AuditLogCreate, db: Session = Depends(get_db)):
    return audit_service.create_audit_log(db=db, audit_log=audit_log)

@router.get("/", response_model=List[schemas.AuditLog])
def read_audit_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    audit_logs = audit_service.get_audit_logs(db, skip=skip, limit=limit)
    return audit_logs

@router.get("/{loan_id}", response_model=List[schemas.AuditLog])
def read_audit_logs_for_loan(loan_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    audit_logs = audit_service.get_audit_logs_for_loan(db, loan_id=loan_id, skip=skip, limit=limit)
    if not audit_logs:
        raise HTTPException(status_code=404, detail="Audit logs for this loan not found")
    return audit_logs
