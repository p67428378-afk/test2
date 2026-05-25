
from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import List, Optional

class CampaignBase(BaseModel):
    name: str
    brand_id: str
    start_date: datetime
    end_date: datetime

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase):
    campaign_id: UUID4

    class Config:
        orm_mode = True

class DeliverableBase(BaseModel):
    description: str
    platform: str
    due_date: datetime

class DeliverableCreate(DeliverableBase):
    pass

class Deliverable(DeliverableBase):
    deliverable_id: UUID4
    status: str

    class Config:
        orm_mode = True

class SocialMediaAccountBase(BaseModel):
    platform: str
    auth_code: str

class SocialMediaAccountCreate(SocialMediaAccountBase):
    pass

class SocialMediaAccount(BaseModel):
    account_id: UUID4

    class Config:
        orm_mode = True

class EngagementMetricBase(BaseModel):
    metric_type: str
    value: int
    timestamp: datetime
    content_id: str

class EngagementMetricCreate(EngagementMetricBase):
    pass

class EngagementMetric(EngagementMetricBase):
    metric_id: UUID4
    account_id: UUID4

    class Config:
        orm_mode = True
