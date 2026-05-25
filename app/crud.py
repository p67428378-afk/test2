from sqlalchemy.orm import Session
from . import models, schemas

def get_policy(db: Session, policy_id: int):
    return db.query(models.Policy).filter(models.Policy.id == policy_id).first()

def get_policies_by_holder(db: Session, policy_holder_id: int):
    return db.query(models.Policy).filter(models.Policy.policy_holder_id == policy_holder_id).all()

def create_policy(db: Session, policy: schemas.PolicyCreate, policy_holder_id: int):
    db_policy = models.Policy(**policy.model_dump(), policy_holder_id=policy_holder_id)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def create_policy_holder(db: Session, policy_holder: schemas.PolicyHolderCreate):
    db_policy_holder = models.PolicyHolder(**policy_holder.model_dump())
    db.add(db_policy_holder)
    db.commit()
    db.refresh(db_policy_holder)
    return db_policy_holder

def update_policy(db: Session, policy_id: int, policy_update: schemas.PolicyUpdate):
    policy = get_policy(db, policy_id)
    if not policy:
        return None
    policy_holder = policy.policy_holder
    if policy_update.contact_information:
        policy_holder.contact_information = policy_update.contact_information
    if policy_update.address:
        policy_holder.address = policy_update.address
    db.commit()
    db.refresh(policy)
    return policy

def cancel_policy(db: Session, policy_id: int):
    policy = get_policy(db, policy_id)
    if not policy:
        return None
    policy.status = "Cancelled"
    db.commit()
    db.refresh(policy)
    return policy
