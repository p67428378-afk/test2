from sqlalchemy.orm import Session, joinedload
from .. import models, schemas
from fastapi import HTTPException
from datetime import date

def get_policy(db: Session, policy_id: str):
    policy = db.query(models.Policy).options(joinedload(models.Policy.coverage_options), joinedload(models.Policy.policy_history)).filter(models.Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy

def update_policy_coverage(db: Session, policy_id: str, coverage_update: schemas.CoverageOptionUpdate):
    policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    # Business logic: Changes take effect after the next billing date
    if coverage_update.start_date <= date.today():
        raise HTTPException(status_code=400, detail="Coverage changes can only be scheduled after today.")

    # Create a new coverage option or update existing one
    # For simplicity, let's assume we are adding a new coverage option for now
    new_coverage = models.CoverageOption(**coverage_update.model_dump(), policy_id=policy_id)
    db.add(new_coverage)
    db.commit()
    db.refresh(new_coverage)

    # Add to policy history
    history_entry = models.PolicyHistory(
        policy_id=policy_id,
        action="Coverage Update",
        timestamp=date.today(),
        user="policyholder", # This should come from authenticated user
        changes_made=f"Updated coverage type {coverage_update.coverage_type} with details {coverage_update.details}"
    )
    db.add(history_entry)
    db.commit()
    db.refresh(history_entry)

    db.refresh(policy) # Refresh policy to load new coverage options and history
    return policy

def cancel_policy(db: Session, policy_id: str):
    policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    # Edge case: Prevent cancellation if pending claims or regulatory restrictions
    # For now, let's assume no such restrictions exist.
    # In a real application, this would involve checking other systems/tables.

    policy.status = "Cancelled"
    db.commit()
    db.refresh(policy)

    # Add to policy history
    history_entry = models.PolicyHistory(
        policy_id=policy_id,
        action="Policy Cancellation",
        timestamp=date.today(),
        user="policyholder", # This should come from authenticated user
        changes_made="Policy cancelled"
    )
    db.add(history_entry)
    db.commit()
    db.refresh(history_entry)

    db.refresh(policy) # Refresh policy to load new history
    return policy
