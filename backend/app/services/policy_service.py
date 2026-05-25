from sqlalchemy.orm import Session
from .. import models, schemas
from fastapi import HTTPException

def create_policy_holder(db: Session, policy_holder: schemas.PolicyHolderCreate):
    db_policy_holder = models.PolicyHolder(**policy_holder.model_dump())
    db.add(db_policy_holder)
    db.commit()
    db.refresh(db_policy_holder)
    return db_policy_holder

def get_policy_holder(db: Session, user_id: str):
    return db.query(models.PolicyHolder).filter(models.PolicyHolder.user_id == user_id).first()

def get_policy_holder_by_email(db: Session, email: str):
    return db.query(models.PolicyHolder).filter(models.PolicyHolder.email == email).first()

def get_policy_holders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.PolicyHolder).offset(skip).limit(limit).all()

def update_policy_holder(db: Session, user_id: str, policy_holder: schemas.PolicyHolderUpdate):
    db_policy_holder = get_policy_holder(db, user_id)
    if not db_policy_holder:
        raise HTTPException(status_code=404, detail="Policy holder not found")
    for key, value in policy_holder.model_dump(exclude_unset=True).items():
        setattr(db_policy_holder, key, value)
    db.commit()
    db.refresh(db_policy_holder)
    return db_policy_holder

def delete_policy_holder(db: Session, user_id: str):
    db_policy_holder = get_policy_holder(db, user_id)
    if not db_policy_holder:
        raise HTTPException(status_code=404, detail="Policy holder not found")
    db.delete(db_policy_holder)
    db.commit()
    return {"message": "Policy holder deleted successfully"}

def create_policy(db: Session, policy: schemas.PolicyCreate, user_id: str):
    db_policy = models.Policy(**policy.model_dump(), user_id=user_id)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def get_policy(db: Session, policy_id: str):
    return db.query(models.Policy).filter(models.Policy.policy_id == policy_id).first()

def get_policies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Policy).offset(skip).limit(limit).all()

def get_policy_holder_policies(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.Policy).filter(models.Policy.user_id == user_id).offset(skip).limit(limit).all()

def update_policy(db: Session, policy_id: str, policy: schemas.PolicyUpdate):
    db_policy = get_policy(db, policy_id)
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    for key, value in policy.model_dump(exclude_unset=True).items():
        setattr(db_policy, key, value)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def delete_policy(db: Session, policy_id: str):
    db_policy = get_policy(db, policy_id)
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    db.delete(db_policy)
    db.commit()
    return {"message": "Policy deleted successfully"}
