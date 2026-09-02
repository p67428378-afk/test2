import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.site import ExcavationSite
from server.schemas.site import SiteCreate, SiteUpdate, SiteResponse

router = APIRouter(prefix="/sites", tags=["Sites"])


@router.get("", response_model=List[SiteResponse])
def get_sites(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    region: Optional[str] = None,
    historical_period: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(ExcavationSite)
    if region:
        query = query.filter(ExcavationSite.region.ilike(f"%{region}%"))
    if historical_period:
        query = query.filter(ExcavationSite.historical_period.ilike(f"%{historical_period}%"))
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=SiteResponse, status_code=status.HTTP_201_CREATED)
def create_site(site_in: SiteCreate, db: Session = Depends(get_db)):
    # Latitude and longitude checks
    if site_in.latitude < -90.0 or site_in.latitude > 90.0:
        raise HTTPException(status_code=400, detail="Latitude must be within [-90, 90]")
    if site_in.longitude < -180.0 or site_in.longitude > 180.0:
        raise HTTPException(status_code=400, detail="Longitude must be within [-180, 180]")

    existing = db.query(ExcavationSite).filter(ExcavationSite.site_code == site_in.site_code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Site with code '{site_in.site_code}' already exists")

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
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_site)
    db.commit()
    db.refresh(new_site)
    return new_site


@router.get("/{site_id}", response_model=SiteResponse)
def get_site(site_id: str, db: Session = Depends(get_db)):
    site = db.query(ExcavationSite).filter(ExcavationSite.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Excavation site with id {site_id} not found")
    return site


@router.patch("/{site_id}", response_model=SiteResponse)
def update_site(site_id: str, site_in: SiteUpdate, db: Session = Depends(get_db)):
    site = db.query(ExcavationSite).filter(ExcavationSite.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Excavation site with id {site_id} not found")

    update_data = site_in.model_dump(exclude_unset=True)
    if "latitude" in update_data and update_data["latitude"] is not None:
        if update_data["latitude"] < -90.0 or update_data["latitude"] > 90.0:
            raise HTTPException(status_code=400, detail="Latitude must be within [-90, 90]")
    if "longitude" in update_data and update_data["longitude"] is not None:
        if update_data["longitude"] < -180.0 or update_data["longitude"] > 180.0:
            raise HTTPException(status_code=400, detail="Longitude must be within [-180, 180]")

    for k, v in update_data.items():
        setattr(site, k, v)

    site.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(site)
    return site


@router.delete("/{site_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_site(site_id: str, db: Session = Depends(get_db)):
    site = db.query(ExcavationSite).filter(ExcavationSite.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail=f"Excavation site with id {site_id} not found")
    db.delete(site)
    db.commit()
    return None
