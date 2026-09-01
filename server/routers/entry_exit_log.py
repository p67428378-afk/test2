import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.entry_exit_log import (
    CheckInRequest,
    CheckOutRequest,
    EntryExitLogOut,
)
from server.services import gate_service

router = APIRouter(prefix="/entry-exit-logs", tags=["EntryExitLogs"])


@router.post(
    "/check-in", response_model=EntryExitLogOut, status_code=status.HTTP_201_CREATED
)
def check_in(
    check_in_data: CheckInRequest,
    db: Session = Depends(get_db),
):
    return gate_service.check_in_visitor(db, check_in_data)


@router.post("/check-out", response_model=EntryExitLogOut)
def check_out(
    check_out_data: CheckOutRequest,
    db: Session = Depends(get_db),
):
    return gate_service.check_out_visitor(db, check_out_data)


@router.get("", response_model=List[EntryExitLogOut])
def list_logs(
    appointment_id: Optional[uuid.UUID] = Query(None),
    active_only: bool = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return gate_service.list_entry_exit_logs(
        db,
        appointment_id=appointment_id,
        active_only=active_only,
        skip=skip,
        limit=limit,
    )
