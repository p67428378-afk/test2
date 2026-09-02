from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.custody import (
    StorageContainerCreate,
    StorageContainerResponse,
    CustodyTransferCreate,
    CustodyTransferResponse,
)
from server.services.custody import (
    create_storage_container,
    list_storage_containers,
    transfer_custody,
    get_custody_history,
)

router = APIRouter(prefix="/custody", tags=["Chain of Custody & Storage"])


@router.post(
    "/storage-containers",
    response_model=StorageContainerResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_storage_container(
    container_in: StorageContainerCreate, db: Session = Depends(get_db)
):
    return create_storage_container(db=db, container_in=container_in)


@router.get("/storage-containers", response_model=List[StorageContainerResponse])
def get_storage_containers(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1),
    db: Session = Depends(get_db),
):
    return list_storage_containers(db=db, skip=skip, limit=limit)


@router.post(
    "/transfer",
    response_model=CustodyTransferResponse,
    status_code=status.HTTP_201_CREATED,
)
def record_custody_transfer(
    transfer_in: CustodyTransferCreate, db: Session = Depends(get_db)
):
    return transfer_custody(db=db, transfer_in=transfer_in)


@router.get("/history/{artifact_id}", response_model=List[CustodyTransferResponse])
def get_artifact_custody_history(artifact_id: str, db: Session = Depends(get_db)):
    return get_custody_history(db=db, artifact_id=artifact_id)
