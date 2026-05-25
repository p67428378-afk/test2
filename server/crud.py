from sqlalchemy.orm import Session
from . import models, schemas
import uuid

# Campaign CRUD
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

def update_campaign(db: Session, campaign_id: uuid.UUID, campaign: schemas.CampaignUpdate):
    db_campaign = get_campaign(db, campaign_id)
    if db_campaign:
        update_data = campaign.dict(exclude_unset=True)
        for key, value in update_data.items():
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

# Deliverable CRUD
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

def update_deliverable(db: Session, deliverable_id: uuid.UUID, deliverable: schemas.DeliverableUpdate):
    db_deliverable = get_deliverable(db, deliverable_id)
    if db_deliverable:
        update_data = deliverable.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_deliverable, key, value)
        db.commit()
        db.refresh(db_deliverable)
    return db_deliverable

# Social Media Account CRUD
def create_social_media_account(db: Session, account: schemas.SocialMediaAccountCreate, influencer_id: uuid.UUID):
    # In a real app, exchange auth_code for tokens here
    db_account = models.SocialMediaAccount(
        platform=account.platform,
        influencer_id=influencer_id,
        platform_user_id="dummy_user_id", # from oauth flow
        access_token="dummy_access_token", # from oauth flow
        refresh_token="dummy_refresh_token" # from oauth flow
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def delete_social_media_account(db: Session, account_id: uuid.UUID):
    db_account = db.query(models.SocialMediaAccount).filter(models.SocialMediaAccount.account_id == account_id).first()
    if db_account:
        db.delete(db_account)
        db.commit()
    return db_account

# Engagement Metric CRUD
def get_engagement_metrics(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.EngagementMetric).offset(skip).limit(limit).all()
