from sqlalchemy.orm import Session
from app.models.policy import Policy, Beneficiary
from app.schemas.policy import PolicyCreate, PolicyUpdate

def get_policies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Policy).offset(skip).limit(limit).all()

def get_policy(db: Session, policy_id: int):
    return db.query(Policy).filter(Policy.id == policy_id).first()

def create_policy(db: Session, policy: PolicyCreate, policy_holder_id: int):
    db_policy = Policy(
        policy_number=policy.policy_number,
        coverage_type=policy.coverage_type,
        effective_date=policy.effective_date,
        expiration_date=policy.expiration_date,
        premium_amount=policy.premium_amount,
        status=policy.status,
        policy_holder_id=policy_holder_id
    )
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    for beneficiary_data in policy.beneficiaries:
        db_beneficiary = Beneficiary(**beneficiary_data.model_dump(), policy_id=db_policy.id)
        db.add(db_beneficiary)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def update_policy(db: Session, policy_id: int, policy: PolicyUpdate):
    db_policy = get_policy(db, policy_id)
    if not db_policy:
        return None
    update_data = policy.model_dump(exclude_unset=True)
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
