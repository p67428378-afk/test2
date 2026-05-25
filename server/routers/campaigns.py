from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.Campaign)
def create_campaign(campaign: schemas.CampaignCreate, db: Session = Depends(get_db)):
    return crud.create_campaign(db=db, campaign=campaign)

@router.get("/", response_model=List[schemas.Campaign])
def read_campaigns(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    campaigns = crud.get_campaigns(db, skip=skip, limit=limit)
    return campaigns

@router.get("/{campaign_id}", response_model=schemas.Campaign)
def read_campaign(campaign_id: uuid.UUID, db: Session = Depends(get_db)):
    db_campaign = crud.get_campaign(db, campaign_id=campaign_id)
    if db_campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return db_campaign

@router.put("/{campaign_id}", response_model=schemas.Campaign)
def update_campaign(campaign_id: uuid.UUID, campaign: schemas.CampaignUpdate, db: Session = Depends(get_db)):
    db_campaign = crud.update_campaign(db, campaign_id=campaign_id, campaign=campaign)
    if db_campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return db_campaign

@router.delete("/{campaign_id}")
def delete_campaign(campaign_id: uuid.UUID, db: Session = Depends(get_db)):
    db_campaign = crud.delete_campaign(db, campaign_id=campaign_id)
    if db_campaign is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"ok": True}
