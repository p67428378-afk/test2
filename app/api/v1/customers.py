
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.crud import customer as customer_crud
from app.schemas import customer as customer_schema
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=customer_schema.Customer)
def create_customer(customer: customer_schema.CustomerCreate, db: Session = Depends(get_db)):
    return customer_crud.create_customer(db=db, customer=customer)

@router.get("/", response_model=List[customer_schema.Customer])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    customers = customer_crud.get_customers(db, skip=skip, limit=limit)
    return customers

@router.get("/{customer_id}", response_model=customer_schema.Customer)
def read_customer(customer_id: UUID, db: Session = Depends(get_db)):
    db_customer = customer_crud.get_customer(db, customer_id=customer_id)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@router.put("/{customer_id}", response_model=customer_schema.Customer)
def update_customer(customer_id: UUID, customer: customer_schema.CustomerUpdate, db: Session = Depends(get_db)):
    db_customer = customer_crud.update_customer(db, customer_id=customer_id, customer=customer)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer
