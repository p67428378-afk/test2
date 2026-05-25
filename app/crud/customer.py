
from sqlalchemy.orm import Session
from app.models import customer as customer_model
from app.schemas import customer as customer_schema
from uuid import UUID

def get_customer(db: Session, customer_id: UUID):
    return db.query(customer_model.Customer).filter(customer_model.Customer.id == customer_id).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(customer_model.Customer).offset(skip).limit(limit).all()

def create_customer(db: Session, customer: customer_schema.CustomerCreate):
    db_customer = customer_model.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def update_customer(db: Session, customer_id: UUID, customer: customer_schema.CustomerUpdate):
    db_customer = get_customer(db, customer_id)
    if db_customer:
        update_data = customer.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_customer, key, value)
        db.commit()
        db.refresh(db_customer)
    return db_customer
