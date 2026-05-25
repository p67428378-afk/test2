from sqlalchemy.orm import Session
from backend.models.policy import Policy, PolicyHolder
from backend.schemas.policy import PolicyCreate, PolicyHolderCreate, PolicyUpdate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_policy_holder_by_email(db: Session, email: str):
    return db.query(PolicyHolder).filter(PolicyHolder.email == email).first()

def create_policy_holder(db: Session, policy_holder: PolicyHolderCreate):
    hashed_password = pwd_context.hash(policy_holder.password)
    db_policy_holder = PolicyHolder(email=policy_holder.email, hashed_password=hashed_password)
    db.add(db_policy_holder)
    db.commit()
    db.refresh(db_policy_holder)
    return db_policy_holder

def create_policy(db: Session, policy: PolicyCreate, policy_holder_id: int):
    db_policy = Policy(**policy.dict(), policy_holder_id=policy_holder_id)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def get_policy(db: Session, policy_id: int):
    return db.query(Policy).filter(Policy.id == policy_id).first()

def update_policy(db: Session, policy_id: int, policy: PolicyUpdate):
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
