from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.sync import (
    BatchSyncRequest,
    BatchSyncResponse,
    SyncStatusResponse,
)
from server.services.sync import process_batch_sync, get_sync_status

router = APIRouter(prefix="/sync", tags=["Offline Synchronization"])


@router.post(
    "/batch",
    response_model=BatchSyncResponse,
    status_code=status.HTTP_200_OK,
)
def sync_batch_offline_logs(
    request: BatchSyncRequest, db: Session = Depends(get_db)
):
    return process_batch_sync(db=db, request=request)


@router.get(
    "/status",
    response_model=SyncStatusResponse,
    status_code=status.HTTP_200_OK,
)
def get_offline_sync_status(db: Session = Depends(get_db)):
    return get_sync_status(db=db)
