from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import ProductCreate, ProductUpdate, ProductResponse, WarrantyStats
from server import crud
from server.models import Product, Warranty

router = APIRouter(prefix="/api/v1/products", tags=["Products"])


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def register_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    """Register a new product and generate its warranty record."""
    return crud.create_product(db, product_in)


@router.get("/stats", response_model=WarrantyStats)
def get_warranty_stats(db: Session = Depends(get_db)):
    """Get total counts for active, expiring soon, and expired warranties."""
    total = db.query(Product).count()
    active = db.query(Warranty).filter(Warranty.status == "ACTIVE").count()
    expiring_soon = (
        db.query(Warranty).filter(Warranty.status == "EXPIRING_SOON").count()
    )
    expired = db.query(Warranty).filter(Warranty.status == "EXPIRED").count()
    return WarrantyStats(
        total_products=total,
        active=active,
        expiring_soon=expiring_soon,
        expired=expired,
    )


@router.get("", response_model=List[ProductResponse])
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List products with optional search, filtering, and pagination."""
    return crud.get_products(
        db,
        skip=skip,
        limit=limit,
        search=search,
        status=status,
        category=category,
        brand=brand,
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product_details(product_id: str, db: Session = Depends(get_db)):
    """Get detailed product and warranty information by ID."""
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product_details(
    product_id: str,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
):
    """Update product registration details."""
    updated = crud.update_product(db, product_id, product_in)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )
    return updated


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_registration(product_id: str, db: Session = Depends(get_db)):
    """Delete a registered product and its associated records."""
    success = crud.delete_product(db, product_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )
    return None
