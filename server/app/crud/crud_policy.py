
from sqlalchemy.orm import Session
from server.app.models.policy import Policy
from server.app.schemas.policy import PolicyCreate

def get_policy(db: Session, policy_id: str):
    return db.query(Policy).filter(Policy.id == policy_id).first()

def create_policy(db: Session, policy: PolicyCreate):
    db_policy = Policy(**policy.dict())
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy
