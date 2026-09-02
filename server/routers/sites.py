import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server.models import ExcavationSite
from server.schemas import SiteCreate, SiteUpdate, SiteResponse, SiteListResponse

router = APIRouter(prefix="/api/v1/sites", tags=["Excavation Sites"])


@router.post("", response_model=SiteResponse, status_code=status.HTTP_201_CREATED)
def create_site(site_in: SiteCreate, db: Session = Depends(get_db)):
    # Check duplicate name or site_code
    existing = db.query(ExcavationSite).filter(
        or_(
            ExcavationSite.name == site_in.name,
            ExcavationSite.site_code == site_in.site_code
        )
    ).first()
    if existing:
        if existing.name == site_in.name:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Site with name '{site_in.name}' already exists")
        else:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Site with code '{site_in.site_code}' already exists")

    new_site = ExcavationSite(
        id=str(uuid.uuid4()),
        name=site_in.name,
        site_code=site_in.site_code,
        region=site_in.region,
        historical_period=site_in.historical_period,
        latitude=site_in.latitude,
        longitude=site_in.longitude,
        altitude_meters=site_in.altitude_meters,
        description=site_in.description,
    )
    db.add(new_site)
    db.commit()
    db.refresh(new_site)
    return new_site


@router.get("", response_model=SiteListResponse)
def list_sites(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    region: Optional[str] = None,
    period: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(ExcavationSite)
    if region:
        query = query.filter(ExcavationSite.region.ilike(f"%{region}%"))
    if period:
        query = query.filter(ExcavationSite.historical_period.ilike(f"%{period}%"))
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                ExcavationSite.name.ilike(search_filter),
                ExcavationSite.site_code.ilike(search_filter),
                ExcavationSite.description.ilike(search_filter),
            )
        )

    total = query.count()
    items = query.order_by(ExcavationSite.created_at.desc()).offset(skip).limit(limit).all()
    return SiteListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{site_id}", response_model=SiteResponse)
def get_site(site_id: str, db: Session = Depends(get_db)):
    site = db.query(ExcavationSite).filter(ExcavationSite.id == site_id).first()
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Excavation site '{site_id}' not found")
    return site


@router.patch("/{site_id}", response_model=SiteResponse)
def update_site(site_id: str, site_in: SiteUpdate, db: Session = Depends(get_db)):
    site = db.query(ExcavationSite).filter(ExcavationSite.id == site_id).first()
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Excavation site '{site_id}' not found")

    update_data = site_in.model_dump(exclude_unset=True)
    if "name" in update_data and update_data["name"] != site.name:
        if db.query(ExcavationSite).filter(ExcavationSite.name == update_data["name"]).first():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Site name already taken")
    if "site_code" in update_data and update_data["site_code"] != site.site_code:
        if db.query(ExcavationSite).filter(ExcavationSite.site_code == update_data["site_code"]).first():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Site code already taken")

    for key, value in update_data.items():
        setattr(site, key, value)

    db.commit()
    db.refresh(site)
    return site


@router.delete("/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_site(site_id: str, db: Session = Depends(get_db)):
    site = db.query(ExcavationSite).filter(ExcavationSite.id == site_id).first()
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Excavation site '{site_id}' not found")
    db.delete(site)
    db.commit()
    return None
