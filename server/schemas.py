from pydantic import BaseModel, UUID4
from typing import List, Optional
from datetime import datetime

# Campaign Schemas
class CampaignBase(BaseModel):
    name: str
    brand_id: str
    start_date: datetime
    end_date: datetime

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(CampaignBase):
    pass

class Campaign(CampaignBase):
    campaign_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Deliverable Schemas
class DeliverableBase(BaseModel):
    description: str
    platform: str
    due_date: datetime
    status: Optional[str] = "pending"

class DeliverableCreate(DeliverableBase):
    pass

class DeliverableUpdate(DeliverableBase):
    pass

class Deliverable(DeliverableBase):
    deliverable_id: UUID4
    campaign_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Social Media Account Schemas
class SocialMediaAccountBase(BaseModel):
    platform: str
    auth_code: str

class SocialMediaAccountCreate(SocialMediaAccountBase):
    pass

class SocialMediaAccount(BaseModel):
    account_id: UUID4
    platform: str

    class Config:
        orm_mode = True

# Engagement Metric Schemas
class EngagementMetricBase(BaseModel):
    metric_type: str
    value: int
    timestamp: datetime
    content_id: str

class EngagementMetric(EngagementMetricBase):
    metric_id: UUID4
    account_id: UUID4

    class Config:
        orm_mode = True
