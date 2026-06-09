from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from server import crud, schemas, database

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.get("", response_model=schemas.ProductListResponse)
def read_inventory(skip: int = 0, limit: int = 20, db: Session = Depends(database.get_db)):
    items, total = crud.get_products(db, skip=skip, limit=limit)
    return {"items": items, "total": total, "skip": skip, "limit": limit}

@router.post("", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(database.get_db)):
    return crud.create_product(db, product)

@router.put("/{product_id}", response_model=schemas.ProductResponse)
def update_product(product_id: UUID, product: schemas.ProductUpdate, db: Session = Depends(database.get_db)):
    db_product = crud.update_product(db, product_id, product)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/{product_id}")
def delete_product(product_id: UUID, db: Session = Depends(database.get_db)):
    success = crud.delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True}
