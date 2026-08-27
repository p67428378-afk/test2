import csv
import io
import uuid
import random
from datetime import datetime, timezone
from typing import Optional, Tuple, List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from server.models.campaign import Campaign
from server.models.donation import Donation
from server.schemas.donation import DonationCreate


class DonationService:
    @staticmethod
    def process_donation(
        db: Session, donation_in: DonationCreate, user_id: Optional[str] = None
    ) -> Donation:
        if donation_in.amount <= 0:
            raise HTTPException(
                status_code=400, detail="Donation amount must be greater than zero."
            )

        # Check campaign exists and is active
        campaign = (
            db.query(Campaign).filter(Campaign.id == donation_in.campaign_id).first()
        )
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")

        if campaign.status not in ["Active", "Completed"]:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot donate to campaign with status '{campaign.status}'",
            )

        # Generate unique transaction ID
        date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
        rand_suffix = f"{random.randint(1000, 9999)}"
        txn_id = f"TXN-{date_str}-{rand_suffix}"

        # Create donation
        donation = Donation(
            id=str(uuid.uuid4()),
            campaign_id=campaign.id,
            user_id=user_id,
            donor_name=donation_in.donor_name,
            donor_email=donation_in.donor_email,
            amount=float(donation_in.amount),
            payment_status="Completed",
            transaction_id=txn_id,
            created_at=datetime.now(timezone.utc),
        )
        db.add(donation)

        # Atomic update of campaign current_amount
        campaign.current_amount = Campaign.current_amount + float(donation_in.amount)

        db.commit()
        db.refresh(donation)
        db.refresh(campaign)
        return donation

    @staticmethod
    def get_donations(
        db: Session,
        campaign_id: Optional[str] = None,
        donor_name: Optional[str] = None,
        donor_email: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[Donation], int]:
        query = db.query(Donation)

        if campaign_id:
            query = query.filter(Donation.campaign_id == campaign_id)

        if donor_name and donor_name.strip():
            query = query.filter(Donation.donor_name.ilike(f"%{donor_name.strip()}%"))

        if donor_email and donor_email.strip():
            query = query.filter(Donation.donor_email.ilike(f"%{donor_email.strip()}%"))

        total = query.count()
        donations = (
            query.order_by(Donation.created_at.desc()).offset(skip).limit(limit).all()
        )
        return donations, total

    @staticmethod
    def get_user_donations(
        db: Session, user_id: str, skip: int = 0, limit: int = 20
    ) -> Tuple[List[Donation], int]:
        query = db.query(Donation).filter(Donation.user_id == user_id)
        total = query.count()
        donations = (
            query.order_by(Donation.created_at.desc()).offset(skip).limit(limit).all()
        )
        return donations, total

    @staticmethod
    def export_donations_csv(db: Session, campaign_id: Optional[str] = None) -> str:
        donations, _ = DonationService.get_donations(
            db, campaign_id=campaign_id, skip=0, limit=10000
        )

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(
            [
                "Transaction ID",
                "Donation ID",
                "Campaign ID",
                "Campaign Title",
                "Donor Name",
                "Donor Email",
                "Amount ($)",
                "Payment Status",
                "Created At (UTC)",
            ]
        )

        for d in donations:
            campaign_title = d.campaign.title if d.campaign else ""
            writer.writerow(
                [
                    d.transaction_id,
                    d.id,
                    d.campaign_id,
                    campaign_title,
                    d.donor_name,
                    d.donor_email,
                    f"{d.amount:.2f}",
                    d.payment_status,
                    d.created_at.isoformat() if d.created_at else "",
                ]
            )

        return output.getvalue()
