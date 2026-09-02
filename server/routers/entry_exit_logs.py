from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas

router = APIRouter(prefix="/api/v1/entry-exit-logs", tags=["Gate Entry & Exit Logs"])


@router.post(
    "/check-in",
    response_model=schemas.EntryExitLogResponse,
    status_code=status.HTTP_201_CREATED,
)
def manual_check_in(log_in: schemas.ManualCheckInCreate, db: Session = Depends(get_db)):
    appointment = (
        db.query(models.Appointment)
        .filter(models.Appointment.id == log_in.appointment_id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    log_entry = models.EntryExitLog(
        appointment_id=log_in.appointment_id,
        officer_id=log_in.officer_id,
        check_in_time=now,
        entry_method="MANUAL",
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry


@router.post("/check-out", response_model=schemas.EntryExitLogResponse)
def check_out(log_in: schemas.CheckOutCreate, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    log_entry = (
        db.query(models.EntryExitLog)
        .filter(
            models.EntryExitLog.appointment_id == log_in.appointment_id,
            models.EntryExitLog.check_out_time.is_(None),
        )
        .order_by(models.EntryExitLog.created_at.desc())
        .first()
    )

    if not log_entry:
        # Create an exit record if no open check-in found
        log_entry = models.EntryExitLog(
            appointment_id=log_in.appointment_id,
            officer_id=log_in.officer_id,
            check_out_time=now,
            entry_method="MANUAL",
        )
        db.add(log_entry)
    else:
        log_entry.check_out_time = now

    db.commit()
    db.refresh(log_entry)
    return log_entry


@router.get("", response_model=List[schemas.EntryExitLogResponse])
def list_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    appointment_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.EntryExitLog)
    if appointment_id:
        query = query.filter(models.EntryExitLog.appointment_id == appointment_id)
    return (
        query.order_by(models.EntryExitLog.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
