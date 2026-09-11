from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User
from server.schemas import (
    ContractCreate,
    ContractUpdate,
    ContractOut,
    ContractListOut,
    ContractVersionOut,
)
from server.auth import get_current_user
from server.services import (
    create_contract,
    get_contracts,
    get_contract_by_id,
    update_contract,
    get_contract_versions,
)

router = APIRouter(prefix="/api/v1/contracts", tags=["Contracts"])


@router.post("", response_model=ContractOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ContractOut, status_code=status.HTTP_201_CREATED)
def create_new_contract(
    contract_in: ContractCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_contract(db, contract_in, current_user)


@router.get("", response_model=ContractListOut)
@router.get("/", response_model=ContractListOut)
def list_all_contracts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    vendor_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items, total = get_contracts(
        db,
        skip=skip,
        limit=limit,
        status_filter=status,
        vendor_id=vendor_id,
        user=current_user,
    )
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/{id}", response_model=ContractOut)
def get_single_contract(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_contract_by_id(db, id)


@router.put("/{id}", response_model=ContractOut)
def update_existing_contract(
    id: str,
    contract_in: ContractUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_contract(db, id, contract_in, current_user)


@router.get("/{id}/versions", response_model=List[ContractVersionOut])
def list_contract_versions(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_contract_versions(db, id)
