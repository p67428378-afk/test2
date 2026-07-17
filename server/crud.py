from sqlalchemy.orm import Session
from server.models import SKU, KPI, AssortmentReview
from typing import List, Optional


def get_kpis(db: Session) -> Optional[KPI]:
    return db.query(KPI).first()


def get_skus(db: Session, status: Optional[str] = None) -> List[SKU]:
    query = db.query(SKU)
    if status:
        query = query.filter(SKU.status == status)
    return query.all()


def create_assortment_review(
    db: Session, scenario_name: str, submitted_by: str
) -> AssortmentReview:
    review = AssortmentReview(scenario_name=scenario_name, submitted_by=submitted_by)
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
