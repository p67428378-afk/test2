from sqlalchemy.orm import Session, joinedload
from server.models import User, Item, ItemImage, Claim, ClaimHistory
from server.schemas import UserCreate, ItemCreate, ClaimCreate
from server.security import get_password_hash
import uuid


# User CRUD
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):
    hashed_pw = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_pw,
        full_name=user.full_name,
        role=user.role,
    )
    db.add(db_user)
    return db_user


# Item CRUD
def get_item(db: Session, item_id: str):
    return (
        db.query(Item)
        .options(joinedload(Item.images))
        .filter(Item.id == item_id)
        .first()
    )


def get_items(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    type_filter: str = None,
    status_filter: str = None,
):
    query = db.query(Item).options(joinedload(Item.images))
    if type_filter:
        query = query.filter(Item.type == type_filter)
    if status_filter:
        query = query.filter(Item.status == status_filter)
    return query.order_by(Item.created_at.desc()).offset(skip).limit(limit).all()


def create_item(db: Session, item: ItemCreate, reporter_id: str):
    item_id = str(uuid.uuid4())
    db_item = Item(
        id=item_id,
        reporter_id=reporter_id,
        type=item.type,
        category=item.category,
        name=item.name,
        description=item.description,
        location=item.location,
        date_incident=item.date_incident,
        contact_info=item.contact_info,
    )
    db.add(db_item)

    for img in item.images:
        db_img = ItemImage(
            item_id=item_id,
            image_url=img.image_url,
            file_size_mb=img.file_size_mb,
        )
        db.add(db_img)

    return db_item


# Claim CRUD
def get_claim(db: Session, claim_id: str):
    return db.query(Claim).filter(Claim.id == claim_id).first()


def get_claims(db: Session, skip: int = 0, limit: int = 100, status_filter: str = None):
    query = db.query(Claim)
    if status_filter:
        query = query.filter(Claim.status == status_filter)
    return query.order_by(Claim.created_at.desc()).offset(skip).limit(limit).all()


def create_claim(db: Session, claim: ClaimCreate, claimant_id: str):
    db_claim = Claim(
        item_id=claim.item_id,
        claimant_id=claimant_id,
        proof_of_ownership=claim.proof_of_ownership,
    )
    db.add(db_claim)
    return db_claim


# Claim History CRUD
def create_history_entry(
    db: Session,
    item_id: str,
    actor_id: str,
    action: str,
    details: str,
    claim_id: str = None,
):
    db_history = ClaimHistory(
        item_id=item_id,
        claim_id=claim_id,
        actor_id=actor_id,
        action=action,
        details=details,
    )
    db.add(db_history)
    return db_history


def get_item_history(db: Session, item_id: str):
    return (
        db.query(ClaimHistory)
        .filter(ClaimHistory.item_id == item_id)
        .order_by(ClaimHistory.created_at.asc())
        .all()
    )
