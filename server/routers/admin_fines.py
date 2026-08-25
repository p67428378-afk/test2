from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User
from server.auth import require_admin_role
from server.schemas import (
    FineCreate,
    FineUpdate,
    FineResponse,
    AuditLogResponse,
)
from server.services import fine_service, audit_service

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin Fine Management"],
    dependencies=[Depends(require_admin_role)],
)


@router.get("/fines", response_model=List[FineResponse])
def list_fines(
    status_filter: Optional[str] = Query(None, alias="status"),
    license_plate: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return fine_service.list_all_fines(
        db=db,
        skip=skip,
        limit=limit,
        status_filter=status_filter,
        license_plate=license_plate,
    )


@router.post("/fines", response_model=FineResponse, status_code=status.HTTP_201_CREATED)
def create_fine(
    fine_in: FineCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin_role),
):
    return fine_service.create_fine(db=db, fine_in=fine_in, actor_id=admin_user.email)


@router.put("/fines/{id}", response_model=FineResponse)
def update_fine(
    id: str,
    fine_in: FineUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin_role),
):
    return fine_service.update_fine(
        db=db, fine_id=id, fine_in=fine_in, actor_id=admin_user.email
    )


@router.delete("/fines/{id}", response_model=FineResponse)
def void_fine(
    id: str,
    notes: str = Query(..., description="Void justification notes"),
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin_role),
):
    return fine_service.void_fine(
        db=db, fine_id=id, notes=notes, actor_id=admin_user.email
    )


@router.get("/audit-logs", response_model=List[AuditLogResponse])
def list_audit_logs(
    fine_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return audit_service.get_audit_logs(db=db, fine_id=fine_id, skip=skip, limit=limit)
