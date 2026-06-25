from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/kpis", response_model=schemas.KPIResponse)
def get_kpis():
    # Static KPI data as specified in the API contract
    return {
        "business_per_branch": 12500000.0,
        "capacity_utilization": 78.2,
        "casa_ratio": 42.5,
        "scheme_availability": 99.8,
    }


@router.get("/products", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = crud.get_products(db)
    return products
