from sqlalchemy.orm import Session
from app.models import policy as policy_model
from app.schemas import policy as policy_schema

def get_policy(db: Session, policy_id: int):
    return db.query(policy_model.Policy).filter(policy_model.Policy.id == policy_id).first()

def get_policies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(policy_model.Policy).offset(skip).limit(limit).all()

def create_policy(db: Session, policy: policy_schema.PolicyCreate):
    db_policy = policy_model.Policy(**policy.dict())
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def update_policy(db: Session, policy_id: int, policy: policy_schema.PolicyUpdate):
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

def delete_policy(db: Session, policy_id: int):
    db_policy = get_policy(db, policy_id)
    if not db_policy:
        return None
    db.delete(db_policy)
    db.commit()
    return db_policy
