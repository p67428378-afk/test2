
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from .. import crud, schemas
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.Campaign])
def read_campaigns(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    campaigns = crud.get_campaigns(db, skip=skip, limit=limit)
    return campaigns

@router.post("/", response_model=schemas.Campaign)
def create_campaign(campaign: schemas.CampaignCreate, db: Session = Depends(get_db)):
    return crud.create_campaign(db=db, campaign=campaign)

@router.get("/{campaign_id}", response_model=schemas.Campaign)
def read_campaign(campaign_id: uuid.UUID, db: Session = Depends(get_db)):
    db_campaign = crud.get_campaign(db, campaign_id=campaign_id)
    if db_campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return db_campaign

@router.put("/{campaign_id}", response_model=schemas.Campaign)
def update_campaign(campaign_id: uuid.UUID, campaign: schemas.CampaignCreate, db: Session = Depends(get_db)):
    db_campaign = crud.update_campaign(db, campaign_id=campaign_id, campaign=campaign)
    if db_campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return db_campaign

@router.delete("/{campaign_id}", response_model=schemas.Campaign)
def delete_campaign(campaign_id: uuid.UUID, db: Session = Depends(get_db)):
    db_campaign = crud.delete_campaign(db, campaign_id=campaign_id)
    if db_campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return db_campaign

@router.get("/{campaign_id}/deliverables", response_model=List[schemas.Deliverable])
def read_campaign_deliverables(campaign_id: uuid.UUID, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    deliverables = crud.get_deliverables_by_campaign(db, campaign_id=campaign_id, skip=skip, limit=limit)
    return deliverables

@router.post("/{campaign_id}/deliverables", response_model=schemas.Deliverable)
def create_campaign_deliverable(campaign_id: uuid.UUID, deliverable: schemas.DeliverableCreate, db: Session = Depends(get_db)):
    return crud.create_deliverable(db=db, deliverable=deliverable, campaign_id=campaign_id)
