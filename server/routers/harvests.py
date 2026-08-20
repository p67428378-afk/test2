from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import HoneyHarvest, Hive
from server.schemas import HoneyHarvestCreate, HoneyHarvestResponse

router = APIRouter(prefix="/api/v1/harvests", tags=["Honey Harvests"])


@router.get("", response_model=List[HoneyHarvestResponse])
def list_harvests(
    hive_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(HoneyHarvest)
    if hive_id:
        query = query.filter(HoneyHarvest.hive_id == hive_id)

    harvests = (
        query.order_by(HoneyHarvest.harvest_date.desc()).offset(skip).limit(limit).all()
    )
    return harvests


@router.post(
    "", response_model=HoneyHarvestResponse, status_code=status.HTTP_201_CREATED
)
def create_harvest(payload: HoneyHarvestCreate, db: Session = Depends(get_db)):
    hive = db.query(Hive).filter(Hive.id == payload.hive_id).first()
    if not hive:
        raise HTTPException(
            status_code=404, detail=f"Hive '{payload.hive_id}' not found."
        )

    harvest = HoneyHarvest(
        hive_id=payload.hive_id,
        harvest_date=payload.harvest_date,
        quantity_kg=payload.quantity_kg,
        honey_type=payload.honey_type,
        moisture_content_percent=payload.moisture_content_percent,
    )
    db.add(harvest)
    db.commit()
    db.refresh(harvest)
    return harvest
