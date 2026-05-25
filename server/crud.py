
from sqlalchemy.orm import Session
from . import models, schemas
import uuid

def get_campaign(db: Session, campaign_id: uuid.UUID):
    return db.query(models.Campaign).filter(models.Campaign.campaign_id == campaign_id).first()

def get_campaigns(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Campaign).offset(skip).limit(limit).all()

def create_campaign(db: Session, campaign: schemas.CampaignCreate):
    db_campaign = models.Campaign(**campaign.dict())
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

def update_campaign(db: Session, campaign_id: uuid.UUID, campaign: schemas.CampaignCreate):
    db_campaign = get_campaign(db, campaign_id)
    if db_campaign:
        for key, value in campaign.dict().items():
            setattr(db_campaign, key, value)
        db.commit()
        db.refresh(db_campaign)
    return db_campaign

def delete_campaign(db: Session, campaign_id: uuid.UUID):
    db_campaign = get_campaign(db, campaign_id)
    if db_campaign:
        db.delete(db_campaign)
        db.commit()
    return db_campaign

def get_deliverable(db: Session, deliverable_id: uuid.UUID):
    return db.query(models.Deliverable).filter(models.Deliverable.deliverable_id == deliverable_id).first()

def get_deliverables_by_campaign(db: Session, campaign_id: uuid.UUID, skip: int = 0, limit: int = 100):
    return db.query(models.Deliverable).filter(models.Deliverable.campaign_id == campaign_id).offset(skip).limit(limit).all()

def create_deliverable(db: Session, deliverable: schemas.DeliverableCreate, campaign_id: uuid.UUID):
    db_deliverable = models.Deliverable(**deliverable.dict(), campaign_id=campaign_id)
    db.add(db_deliverable)
    db.commit()
    db.refresh(db_deliverable)
    return db_deliverable

def update_deliverable(db: Session, deliverable_id: uuid.UUID, deliverable: schemas.DeliverableCreate):
    db_deliverable = get_deliverable(db, deliverable_id)
    if db_deliverable:
        for key, value in deliverable.dict().items():
            setattr(db_deliverable, key, value)
        db.commit()
        db.refresh(db_deliverable)
    return db_deliverable
