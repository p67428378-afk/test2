from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/campaigns/{campaign_id}/deliverables", response_model=schemas.Deliverable)
def create_deliverable_for_campaign(campaign_id: uuid.UUID, deliverable: schemas.DeliverableCreate, db: Session = Depends(get_db)):
    db_campaign = crud.get_campaign(db, campaign_id=campaign_id)
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return crud.create_deliverable(db=db, deliverable=deliverable, campaign_id=campaign_id)

@router.get("/campaigns/{campaign_id}/deliverables", response_model=List[schemas.Deliverable])
def read_deliverables(campaign_id: uuid.UUID, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    db_campaign = crud.get_campaign(db, campaign_id=campaign_id)
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    deliverables = crud.get_deliverables_by_campaign(db, campaign_id=campaign_id, skip=skip, limit=limit)
    return deliverables

@router.put("/deliverables/{deliverable_id}", response_model=schemas.Deliverable)
def update_deliverable(deliverable_id: uuid.UUID, deliverable: schemas.DeliverableUpdate, db: Session = Depends(get_db)):
    db_deliverable = crud.update_deliverable(db, deliverable_id=deliverable_id, deliverable=deliverable)
    if db_deliverable is None:
        raise HTTPException(status_code=404, detail="Deliverable not found")
    return db_deliverable
