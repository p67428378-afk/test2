from sqlalchemy.orm import Session
from app.models.policy import Policy
from app.schemas.policy import PolicyCreate, PolicyUpdate

def get_policy(db: Session, policy_id: str):
    return db.query(Policy).filter(Policy.id == policy_id).first()

def get_policies_by_holder(db: Session, policy_holder_id: str, skip: int = 0, limit: int = 100):
    return db.query(Policy).filter(Policy.policy_holder_id == policy_holder_id).offset(skip).limit(limit).all()

def create_policy(db: Session, policy: PolicyCreate):
    db_policy = Policy(**policy.model_dump())
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def update_policy(db: Session, db_policy: Policy, policy: PolicyUpdate):
    update_data = policy.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_policy, key, value)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def cancel_policy(db: Session, db_policy: Policy):
    db_policy.status = "cancelled"
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy
