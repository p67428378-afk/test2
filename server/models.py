
import uuid
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Campaign(Base):
    __tablename__ = "Campaigns"
    campaign_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    brand_id = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    deliverables = relationship("Deliverable", back_populates="campaign")

class Deliverable(Base):
    __tablename__ = "Deliverables"
    deliverable_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey('Campaigns.campaign_id'))
    description = Column(String)
    platform = Column(String)
    due_date = Column(DateTime)
    status = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    campaign = relationship("Campaign", back_populates="deliverables")

class SocialMediaAccount(Base):
    __tablename__ = "SocialMediaAccounts"
    account_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    influencer_id = Column(UUID(as_uuid=True))
    platform = Column(String)
    platform_user_id = Column(String)
    access_token = Column(String)
    refresh_token = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    engagement_metrics = relationship("EngagementMetric", back_populates="social_media_account")

class EngagementMetric(Base):
    __tablename__ = "EngagementMetrics"
    metric_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(UUID(as_uuid=True), ForeignKey('SocialMediaAccounts.account_id'))
    content_id = Column(String)
    metric_type = Column(String)
    value = Column(Integer)
    timestamp = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    social_media_account = relationship("SocialMediaAccount", back_populates="engagement_metrics")
