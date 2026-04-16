
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, database

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/policies/{policy_id}", response_model=schemas.Policy)
def read_policy(policy_id: int, db: Session = Depends(get_db)):
    db_policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@app.put("/policies/{policy_id}", response_model=schemas.Policy)
def update_policy(policy_id: int, policy: schemas.PolicyUpdate, db: Session = Depends(get_db)):
    db_policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    update_data = policy.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_policy, key, value)
    
    db.commit()
    db.refresh(db_policy)
    return db_policy

@app.delete("/policies/{policy_id}/cancel")
def cancel_policy(policy_id: int, db: Session = Depends(get_db)):
    db_policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    db_policy.status = "Cancelled"
    db.commit()
    return {"message": "Policy cancellation request submitted successfully"}
