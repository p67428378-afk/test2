from sqlalchemy.orm import Session
from . import models, schemas
import uuid


# User CRUD
def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserRegister, password_hash: str):
    db_user = models.User(
        id=str(uuid.uuid4()),
        email=user.email,
        password_hash=password_hash,
        is_admin=user.is_admin or False,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Item CRUD
def get_item(db: Session, item_id: str):
    return db.query(models.Item).filter(models.Item.id == item_id).first()


def get_items(
    db: Session,
    item_type: str = None,
    category: str = None,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(models.Item)
    if item_type:
        query = query.filter(models.Item.item_type == item_type)
    if category:
        query = query.filter(models.Item.category == category)
    if status:
        query = query.filter(models.Item.status == status)
    return query.offset(skip).limit(limit).all()


def create_item(db: Session, item: schemas.ItemCreate, user_id: str):
    db_item = models.Item(
        id=str(uuid.uuid4()),
        user_id=user_id,
        item_type=item.item_type,
        category=item.category,
        color=item.color,
        brand=item.brand,
        description=item.description,
        location=item.location,
        item_date=item.item_date,
        status="open",
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    # Add images
    if item.image_urls:
        for url in item.image_urls:
            db_image = models.ItemImage(
                id=str(uuid.uuid4()), item_id=db_item.id, image_url=url
            )
            db.add(db_image)
        db.commit()
        db.refresh(db_item)

    return db_item


# Claim CRUD
def get_claim(db: Session, claim_id: str):
    return db.query(models.Claim).filter(models.Claim.id == claim_id).first()


def get_claims(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Claim).offset(skip).limit(limit).all()


def create_claim(db: Session, claim: schemas.ClaimCreate, claimant_id: str):
    db_claim = models.Claim(
        id=str(uuid.uuid4()),
        item_id=claim.item_id,
        claimant_id=claimant_id,
        status="pending",
    )
    db.add(db_claim)
    db.commit()
    db.refresh(db_claim)
    return db_claim


def verify_claim(db: Session, claim_id: str, status: str, verifier_id: str):
    db_claim = get_claim(db, claim_id)
    if db_claim:
        db_claim.status = status
        db_claim.verifier_id = verifier_id
        if status == "approved":
            # Mark the item as claimed/returned
            db_claim.item.status = "returned"
        db.commit()
        db.refresh(db_claim)
    return db_claim


# Message CRUD
def get_messages_by_claim(db: Session, claim_id: str):
    return (
        db.query(models.Message)
        .filter(models.Message.claim_id == claim_id)
        .order_by(models.Message.created_at.asc())
        .all()
    )


def create_message(db: Session, claim_id: str, sender_id: str, text: str):
    db_message = models.Message(
        id=str(uuid.uuid4()), claim_id=claim_id, sender_id=sender_id, text=text
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


# AI Matching Engine
def get_item_matches(db: Session, item_id: str):
    item = get_item(db, item_id)
    if not item:
        return []

    opposite_type = "found" if item.item_type == "lost" else "lost"
    candidates = (
        db.query(models.Item)
        .filter(models.Item.item_type == opposite_type, models.Item.status == "open")
        .all()
    )

    matches = []
    for cand in candidates:
        score = 0.0

        # 1. Categorical similarity (weight: 0.4)
        if cand.category.lower() == item.category.lower():
            score += 0.4

        # 2. Color similarity (weight: 0.15)
        if cand.color and item.color and cand.color.lower() == item.color.lower():
            score += 0.15

        # 3. Brand similarity (weight: 0.15)
        if cand.brand and item.brand and cand.brand.lower() == item.brand.lower():
            score += 0.15

        # 4. Text description similarity (weight: 0.3)
        words1 = set(item.description.lower().split())
        words2 = set(cand.description.lower().split())
        if words1 or words2:
            intersection = words1.intersection(words2)
            union = words1.union(words2)
            jaccard = len(intersection) / len(union) if union else 0.0
            score += jaccard * 0.3

        # 5. Optional Image similarity (weight: 0.1)
        if cand.images and item.images:
            # Simple mock image similarity: if both have images, we add a small boost
            score += 0.1

        if score > 0.1:
            image_url = cand.images[0].image_url if cand.images else None
            matches.append(
                {
                    "matched_item_id": cand.id,
                    "similarity_score": round(score * 100, 2),
                    "category": cand.category,
                    "color": cand.color,
                    "brand": cand.brand,
                    "location": cand.location,
                    "item_date": cand.item_date,
                    "image_url": image_url,
                }
            )

    matches.sort(key=lambda x: x["similarity_score"], reverse=True)
    return matches
