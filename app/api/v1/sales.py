
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.crud import sale as sale_crud
from app.schemas import sale as sale_schema

router = APIRouter()

@router.post("/", response_model=sale_schema.Sale)
def create_sale(sale: sale_schema.SaleCreate, db: Session = Depends(get_db)):
    try:
        return sale_crud.create_sale(db=db, sale=sale)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/history", response_model=List[sale_schema.Sale])
def read_sales_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sales = sale_crud.get_sales_history(db, skip=skip, limit=limit)
    return sales
