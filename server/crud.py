
from sqlalchemy.orm import Session
from server import models, schemas

def create_policy(db: Session, policy_data: dict):
    db_policy = models.Policy(**policy_data)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy
