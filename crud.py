from sqlalchemy.orm import Session, joinedload
from datetime import date
import models, schemas

def get_policy(db: Session, policy_id: str):
    return db.query(models.Policy).options(joinedload(models.Policy.coverage_options), joinedload(models.Policy.beneficiaries)).filter(models.Policy.id == policy_id).first()

def get_policy_by_number(db: Session, policy_number: str):
    return db.query(models.Policy).options(joinedload(models.Policy.coverage_options), joinedload(models.Policy.beneficiaries)).filter(models.Policy.policy_number == policy_number).first()

def get_policies(db: Session, policyholder_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.Policy).options(joinedload(models.Policy.coverage_options), joinedload(models.Policy.beneficiaries)).filter(models.Policy.policyholder_id == policyholder_id).offset(skip).limit(limit).all()

def create_policy(db: Session, policy: schemas.PolicyCreate):
    db_policy = models.Policy(policy_number=policy.policy_number,
                              policyholder_id=policy.policyholder_id,
                              coverage_type=policy.coverage_type,
                              effective_date=policy.effective_date,
                              expiration_date=policy.expiration_date,
                              premium_amount=policy.premium_amount,
                              status=policy.status,
                              last_updated_date=date.today(),
                              created_date=date.today())
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)

    for option in policy.coverage_options:
        db_option = models.CoverageOption(**option.model_dump(), policy_id=db_policy.id)
        db.add(db_option)
    for beneficiary in policy.beneficiaries:
        db_beneficiary = models.Beneficiary(**beneficiary.model_dump(), policy_id=db_policy.id)
        db.add(db_beneficiary)

    db.commit()
    db.refresh(db_policy)
    return db_policy

def update_policy(db: Session, policy_id: str, policy_update: schemas.PolicyUpdate):
    db_policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    if not db_policy:
        return None

    update_data = policy_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key not in ["coverage_options", "beneficiaries"]:
            setattr(db_policy, key, value)

    db_policy.last_updated_date = date.today()

    if policy_update.coverage_options is not None:
        # Delete existing coverage options
        db.query(models.CoverageOption).filter(models.CoverageOption.policy_id == policy_id).delete()
        # Add new coverage options
        for option in policy_update.coverage_options:
            db_option = models.CoverageOption(**option.model_dump(), policy_id=policy_id)
            db.add(db_option)

    if policy_update.beneficiaries is not None:
        # Delete existing beneficiaries
        db.query(models.Beneficiary).filter(models.Beneficiary.policy_id == policy_id).delete()
        # Add new beneficiaries
        for beneficiary in policy_update.beneficiaries:
            db_beneficiary = models.Beneficiary(**beneficiary.model_dump(), policy_id=policy_id)
            db.add(db_beneficiary)

    db.commit()
    db.refresh(db_policy)
    return db_policy

def delete_policy(db: Session, policy_id: str):
    db_policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    if db_policy:
        db.delete(db_policy)
        db.commit()
    return db_policy
