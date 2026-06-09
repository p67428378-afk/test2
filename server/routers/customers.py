from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import crud, schemas, database

router = APIRouter(prefix="/customers", tags=["customers"])

@router.get("", response_model=schemas.CustomerListResponse)
def read_customers(skip: int = 0, limit: int = 20, db: Session = Depends(database.get_db)):
    items, total = crud.get_customers(db, skip=skip, limit=limit)
    return {"items": items, "total": total, "skip": skip, "limit": limit}

@router.post("", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(database.get_db)):
    return crud.create_customer(db, customer)
