from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import crud, models, schemas
from database import SessionLocal, engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/policies/", response_model=schemas.Policy, status_code=status.HTTP_201_CREATED)
def create_policy(policy: schemas.PolicyCreate, db: Session = Depends(get_db)):
    db_policy = crud.get_policy_by_number(db, policy_number=policy.policy_number)
    if db_policy:
        raise HTTPException(status_code=400, detail="Policy number already registered")
    return crud.create_policy(db=db, policy=policy)

@app.get("/policies/{policy_id}", response_model=schemas.Policy)
def read_policy(policy_id: str, db: Session = Depends(get_db)):
    db_policy = crud.get_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@app.get("/policies/policyholder/{policyholder_id}", response_model=List[schemas.Policy])
def read_policies_by_policyholder(policyholder_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    policies = crud.get_policies(db, policyholder_id=policyholder_id, skip=skip, limit=limit)
    return policies

@app.put("/policies/{policy_id}", response_model=schemas.Policy)
def update_policy(policy_id: str, policy: schemas.PolicyUpdate, db: Session = Depends(get_db)):
    db_policy = crud.update_policy(db, policy_id=policy_id, policy_update=policy)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return db_policy

@app.delete("/policies/{policy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_policy(policy_id: str, db: Session = Depends(get_db)):
    db_policy = crud.delete_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return {"ok": True}
