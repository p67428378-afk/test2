from sqlalchemy.orm import Session
from app.models.policy import Policy
from app.schemas.policy import PolicyCreate, PolicyUpdate
import uuid

def get_policy(db: Session, policy_id: str):
    return db.query(Policy).filter(Policy.id == policy_id).first()

def get_policies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Policy).offset(skip).limit(limit).all()

def create_policy(db: Session, policy: PolicyCreate):
    db_policy = Policy(
        id=str(uuid.uuid4()),
        **policy.dict()
    )
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def update_policy(db: Session, policy_id: str, policy: PolicyUpdate):
    db_policy = get_policy(db, policy_id)
    if not db_policy:
        return None
    update_data = policy.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_policy, key, value)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def delete_policy(db: Session, policy_id: str):
    db_policy = get_policy(db, policy_id)
    if not db_policy:
        return None
    db_policy.status = "Cancelled"
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy
