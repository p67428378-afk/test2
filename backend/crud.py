
from sqlalchemy.orm import Session
from . import models, schemas

def get_policy_change_request(db: Session, request_id: int):
    return db.query(models.PolicyChangeRequest).filter(models.PolicyChangeRequest.id == request_id).first()

def get_policy_change_requests_by_policy(db: Session, policy_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.PolicyChangeRequest).filter(models.PolicyChangeRequest.policy_id == policy_id).offset(skip).limit(limit).all()

def create_policy_change_request(db: Session, request: schemas.PolicyChangeRequestCreate):
    db_request = models.PolicyChangeRequest(
        policy_id=request.policy_id,
        request_type=request.request_type,
        request_details=request.request_details,
        submitted_by=request.submitted_by
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request
