from typing import Optional, Tuple, List
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from server.models.campaign import Campaign
from server.models.donation import Donation
from server.schemas.campaign import CampaignCreate, CampaignUpdate


class CampaignService:
    @staticmethod
    def get_campaigns(
        db: Session,
        category: Optional[str] = None,
        search: Optional[str] = None,
        status: Optional[str] = "Active",
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[Campaign], int]:
        query = db.query(Campaign)

        if status and status != "all":
            query = query.filter(Campaign.status == status)

        if category and category.strip():
            query = query.filter(Campaign.category.ilike(f"%{category.strip()}%"))

        if search and search.strip():
            search_pattern = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Campaign.title.ilike(search_pattern),
                    Campaign.description.ilike(search_pattern),
                )
            )

        total = query.count()
        campaigns = (
            query.order_by(Campaign.created_at.desc()).offset(skip).limit(limit).all()
        )
        return campaigns, total

    @staticmethod
    def get_campaign_by_id(db: Session, campaign_id: str) -> Optional[Campaign]:
        return db.query(Campaign).filter(Campaign.id == campaign_id).first()

    @staticmethod
    def get_supporter_count(db: Session, campaign_id: str) -> int:
        return (
            db.query(func.count(Donation.id))
            .filter(Donation.campaign_id == campaign_id)
            .scalar()
            or 0
        )

    @staticmethod
    def create_campaign(db: Session, campaign_in: CampaignCreate) -> Campaign:
        campaign = Campaign(
            title=campaign_in.title,
            description=campaign_in.description,
            target_amount=campaign_in.target_amount,
            current_amount=0.0,
            category=campaign_in.category,
            status=campaign_in.status or "Active",
            start_date=campaign_in.start_date,
            end_date=campaign_in.end_date,
        )
        db.add(campaign)
        db.commit()
        db.refresh(campaign)
        return campaign

    @staticmethod
    def update_campaign(
        db: Session, campaign: Campaign, campaign_in: CampaignUpdate
    ) -> Campaign:
        update_data = campaign_in.model_dump(exclude_unset=True)

        # Additional validation if only one date updated
        start_date = update_data.get("start_date", campaign.start_date)
        end_date = update_data.get("end_date", campaign.end_date)
        if end_date <= start_date:
            raise ValueError("End date must be after start date.")

        for field, value in update_data.items():
            setattr(campaign, field, value)

        db.commit()
        db.refresh(campaign)
        return campaign

    @staticmethod
    def delete_campaign(db: Session, campaign: Campaign) -> None:
        db.delete(campaign)
        db.commit()
