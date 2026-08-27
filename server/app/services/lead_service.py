import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from server.models import Lead
from server.schemas import LeadCreate

logger = logging.getLogger("server.lead_service")


class LeadService:
    @staticmethod
    def create_lead(db: Session, lead_in: LeadCreate) -> Lead:
        logger.info(f"Processing new lead submission from: {lead_in.email}")
        lead = Lead(
            client_name=lead_in.client_name.strip(),
            email=lead_in.email.strip().lower(),
            budget_range=lead_in.budget_range.strip(),
            message=lead_in.message.strip(),
            status="new",
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)
        logger.info(f"Lead saved successfully with ID: {lead.id}")
        return lead

    @staticmethod
    def get_leads(db: Session, skip: int = 0, limit: int = 50) -> List[Lead]:
        return (
            db.query(Lead)
            .order_by(Lead.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_lead_by_id(db: Session, lead_id: str) -> Optional[Lead]:
        return db.query(Lead).filter(Lead.id == lead_id).first()
