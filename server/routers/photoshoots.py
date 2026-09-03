"""Photoshoot records listing and management endpoints."""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.crud import get_all_photoshoot_records
from server.database import get_db
from server.schemas import PhotoshootRecordOut

router = APIRouter(prefix="/api/v1/photoshoots", tags=["photoshoots"])


@router.get("", response_model=List[PhotoshootRecordOut])
def list_photoshoot_records(db: Session = Depends(get_db)):
    return get_all_photoshoot_records(db)
