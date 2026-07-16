from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import schemas, crud
from server.database import get_db
from typing import List
from uuid import UUID

router = APIRouter()

@router.post("/protected-zones", response_model=schemas.ProtectedZoneResponse)
def create_protected_zone(zone: schemas.ProtectedZoneCreate, db: Session = Depends(get_db)):
    return crud.create_protected_zone(db, zone)

@router.get("/protected-zones", response_model=List[schemas.ProtectedZoneResponse])
def list_protected_zones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_protected_zones(db, skip=skip, limit=limit)

@router.get("/protected-zones/{zone_id}", response_model=schemas.ProtectedZoneResponse)
def get_protected_zone(zone_id: UUID, db: Session = Depends(get_db)):
    zone = crud.get_protected_zone(db, zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Protected zone not found")
    return zone

@router.put("/protected-zones/{zone_id}", response_model=schemas.ProtectedZoneResponse)
def update_protected_zone(zone_id: UUID, zone_update: schemas.ProtectedZoneCreate, db: Session = Depends(get_db)):
    zone = crud.get_protected_zone(db, zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Protected zone not found")
    return crud.update_protected_zone(db, zone_id, zone_update)

@router.delete("/protected-zones/{zone_id}")
def delete_protected_zone(zone_id: UUID, db: Session = Depends(get_db)):
    success = crud.delete_protected_zone(db, zone_id)
    if not success:
        raise HTTPException(status_code=404, detail="Protected zone not found")
    return {"status": "success", "message": "Protected zone deleted successfully"}
