from datetime import datetime, timezone
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Package, User
from server.schemas import PackageCreate, PackageUpdate, PackageOut, AddOnOption
from server.auth import require_role

router = APIRouter(prefix="/packages", tags=["Packages & Add-ons"])

STUDIO_ADDONS = [
    AddOnOption(
        id="addon-drone",
        name="Drone Aerial Photography",
        price=250.00,
        description="High-definition 4K aerial shots and cinematic angles.",
    ),
    AddOnOption(
        id="addon-express",
        name="Express 48-Hour Proofing Delivery",
        price=150.00,
        description="Fast-tracked proof gallery delivery within 48 hours.",
    ),
    AddOnOption(
        id="addon-album",
        name="Hardcover Deluxe Photo Album",
        price=300.00,
        description="Custom 30-page heirloom layflat leather-bound photo album.",
    ),
]


@router.get("/addons", response_model=List[AddOnOption])
def list_addons():
    return STUDIO_ADDONS


@router.get("", response_model=List[PackageOut])
def list_packages(db: Session = Depends(get_db)):
    packages = db.query(Package).filter(Package.is_active == True).all()
    return packages


@router.get("/{package_id}", response_model=PackageOut)
def get_package(package_id: str, db: Session = Depends(get_db)):
    pkg = db.query(Package).filter(Package.id == package_id).first()
    if not pkg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Package not found."
        )
    return pkg


@router.post("", response_model=PackageOut, status_code=status.HTTP_201_CREATED)
def create_package(
    pkg_in: PackageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"])),
):
    existing = db.query(Package).filter(Package.name == pkg_in.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Package with this name already exists.",
        )

    pkg = Package(
        id=str(uuid.uuid4()),
        name=pkg_in.name,
        description=pkg_in.description,
        duration_minutes=pkg_in.duration_minutes,
        price=pkg_in.price,
        deliverables_summary=pkg_in.deliverables_summary,
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(pkg)
    db.commit()
    db.refresh(pkg)
    return pkg


@router.put("/{package_id}", response_model=PackageOut)
def update_package(
    package_id: str,
    pkg_in: PackageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"])),
):
    pkg = db.query(Package).filter(Package.id == package_id).first()
    if not pkg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Package not found."
        )

    update_data = pkg_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(pkg, field, val)

    pkg.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(pkg)
    return pkg


@router.delete("/{package_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_package(
    package_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin"])),
):
    pkg = db.query(Package).filter(Package.id == package_id).first()
    if not pkg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Package not found."
        )

    pkg.is_active = False
    pkg.updated_at = datetime.now(timezone.utc)
    db.commit()
    return None
