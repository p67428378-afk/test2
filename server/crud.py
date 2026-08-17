import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from server import models, schemas


# Item CRUD
def create_item(db: Session, item_in: schemas.ItemCreate) -> models.Item:
    item = models.Item(
        name=item_in.name,
        description=item_in.description,
        category=item_in.category,
        location=item_in.location,
        report_date=item_in.report_date,
        contact_info=item_in.contact_info,
        status=item_in.status,
    )
    db.add(item)
    db.flush()  # Get item.id

    if item_in.image_urls:
        for url in item_in.image_urls:
            image = models.ItemImage(item_id=item.id, image_url=url)
            db.add(image)

    db.commit()
    db.refresh(item)
    return item


def get_item(db: Session, item_id: uuid.UUID) -> Optional[models.Item]:
    return db.query(models.Item).filter(models.Item.id == item_id).first()


def list_items(
    db: Session,
    category: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> List[models.Item]:
    query = db.query(models.Item)
    if category:
        query = query.filter(models.Item.category == category)
    if status:
        query = query.filter(models.Item.status == status)
    return query.offset(skip).limit(limit).all()


# Claim CRUD
def create_claim(db: Session, claim_in: schemas.ClaimCreate) -> models.Claim:
    claim = models.Claim(
        item_id=claim_in.item_id,
        claimant_details=claim_in.claimant_details,
        claim_date=claim_in.claim_date,
        status="pending",
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    return claim


def get_claim(db: Session, claim_id: uuid.UUID) -> Optional[models.Claim]:
    return db.query(models.Claim).filter(models.Claim.id == claim_id).first()


def list_claims(
    db: Session,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> List[models.Claim]:
    query = db.query(models.Claim)
    if status:
        query = query.filter(models.Claim.status == status)
    return query.offset(skip).limit(limit).all()


def update_claim_status(db: Session, claim: models.Claim, status: str) -> models.Claim:
    claim.status = status
    db.commit()
    db.refresh(claim)
    return claim
