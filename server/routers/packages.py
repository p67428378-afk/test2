"""Package and Add-on catalog management endpoints."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.crud import (
    create_package,
    delete_package,
    get_addons,
    get_package_by_id,
    get_packages,
    update_package,
)
from server.database import get_db
from server.schemas import AddOnOut, PackageCreate, PackageOut, PackageUpdate

router = APIRouter(prefix="/api/v1/packages", tags=["packages"])


@router.get("", response_model=List[PackageOut])
def list_packages(db: Session = Depends(get_db)):
    return get_packages(db)


@router.get("/addons", response_model=List[AddOnOut])
def list_addons(db: Session = Depends(get_db)):
    return get_addons(db)


@router.get("/{id}", response_model=PackageOut)
def get_package(id: str, db: Session = Depends(get_db)):
    pkg = get_package_by_id(db, id)
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    return pkg


@router.post("", response_model=PackageOut, status_code=status.HTTP_201_CREATED)
def add_package(pkg_in: PackageCreate, db: Session = Depends(get_db)):
    return create_package(db, pkg_in)


@router.put("/{id}", response_model=PackageOut)
def edit_package(id: str, pkg_in: PackageUpdate, db: Session = Depends(get_db)):
    pkg = update_package(db, id, pkg_in)
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    return pkg


@router.delete("/{id}")
def remove_package(id: str, db: Session = Depends(get_db)):
    success = delete_package(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Package not found")
    return {"detail": "Package deleted successfully"}
