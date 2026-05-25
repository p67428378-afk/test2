
from sqlalchemy.orm import Session
from backend import models, schemas

def create_policy_holder(db: Session, policy_holder: schemas.PolicyHolderCreate):
    db_policy_holder = models.PolicyHolder(**policy_holder.dict())
    db.add(db_policy_holder)
    db.commit()
    db.refresh(db_policy_holder)
    return db_policy_holder

def get_policy_holder(db: Session, policy_holder_id: str):
    return db.query(models.PolicyHolder).filter(models.PolicyHolder.id == policy_holder_id).first()

def create_policy(db: Session, policy: schemas.PolicyCreate, policy_holder_id: str):
    db_policy = models.Policy(**policy.dict(), policy_holder_id=policy_holder_id)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def get_policy(db: Session, policy_id: str):
    return db.query(models.Policy).filter(models.Policy.id == policy_id).first()

def update_policy_holder(db: Session, policy_holder_id: str, policy_update: schemas.PolicyUpdate):
    db_policy_holder = get_policy_holder(db, policy_holder_id)
    if not db_policy_holder:
        return None
    update_data = policy_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_policy_holder, key, value)
    db.add(db_policy_holder)
    db.commit()
    db.refresh(db_policy_holder)
    return db_policy_holder

def cancel_policy(db: Session, policy_id: str):
    db_policy = get_policy(db, policy_id)
    if not db_policy:
        return None
    db_policy.status = "Cancelled"
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy
