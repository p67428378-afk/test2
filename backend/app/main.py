from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Product Endpoints
@app.post("/products/", response_model=schemas.CreditCardProduct)
def create_product(product: schemas.CreditCardProductCreate, db: Session = Depends(get_db)):
    db_product = models.CreditCardProduct(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products/", response_model=List[schemas.CreditCardProduct])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = db.query(models.CreditCardProduct).offset(skip).limit(limit).all()
    return products

@app.get("/products/{product_id}", response_model=schemas.CreditCardProduct)
def read_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(models.CreditCardProduct).filter(models.CreditCardProduct.product_id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Application Endpoints
@app.post("/applications/", response_model=schemas.CreditCardApplication)
def create_application(application: schemas.CreditCardApplicationCreate, db: Session = Depends(get_db)):
    db_application = models.CreditCardApplication(**application.model_dump())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

@app.get("/applications/", response_model=List[schemas.CreditCardApplication])
def read_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    applications = db.query(models.CreditCardApplication).offset(skip).limit(limit).all()
    return applications

@app.get("/applications/{application_id}", response_model=schemas.CreditCardApplication)
def read_application(application_id: str, db: Session = Depends(get_db)):
    application = db.query(models.CreditCardApplication).filter(models.CreditCardApplication.application_id == application_id).first()
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return application
