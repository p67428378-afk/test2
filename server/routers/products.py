from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

import server.models as models
import server.schemas as schemas
from server.database import get_db
from server.auth import get_current_user
from server.services.warranty_service import (
    calculate_end_date,
    calculate_warranty_status,
    get_warranty_stats,
)

router = APIRouter(prefix="/api/v1/products", tags=["Products"])


@router.get("/stats", response_model=schemas.WarrantyStatsResponse)
def get_products_stats(db: Session = Depends(get_db)):
    """Get KPI stats for registered products and warranty statuses."""
    return get_warranty_stats(db)


@router.get("", response_model=List[schemas.ProductResponse])
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List registered products with optional search, filtering, and pagination."""
    query = db.query(models.Product)

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                models.Product.product_name.ilike(search_fmt),
                models.Product.serial_number.ilike(search_fmt),
                models.Product.brand.ilike(search_fmt),
                models.Product.category.ilike(search_fmt),
            )
        )

    if category and category.upper() != "ALL":
        query = query.filter(models.Product.category.ilike(category))

    if brand and brand.upper() != "ALL":
        query = query.filter(models.Product.brand.ilike(brand))

    if status and status.upper() != "ALL":
        query = query.join(models.Warranty).filter(
            models.Warranty.status == status.upper()
        )

    products = (
        query.order_by(models.Product.created_at.desc()).offset(skip).limit(limit).all()
    )

    # Dynamic status update on read
    for p in products:
        if p.warranty:
            p.warranty.status = calculate_warranty_status(p.warranty.end_date)

    return products


@router.post(
    "", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED
)
def register_product(
    product_in: schemas.ProductCreate,
    current_user: Optional[models.User] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Register a new product and generate its warranty record."""
    user_id = current_user.id if current_user else None

    # Create Product
    product = models.Product(
        user_id=user_id,
        product_name=product_in.product_name,
        serial_number=product_in.serial_number,
        brand=product_in.brand,
        category=product_in.category,
        purchase_date=product_in.purchase_date,
    )
    db.add(product)
    db.flush()

    # Calculate Warranty details
    start_date = product_in.purchase_date
    end_date = calculate_end_date(start_date, product_in.duration_months)
    warranty_status = calculate_warranty_status(end_date)

    warranty = models.Warranty(
        product_id=product.id,
        duration_months=product_in.duration_months,
        start_date=start_date,
        end_date=end_date,
        status=warranty_status,
        vendor_name=product_in.vendor_name,
    )
    db.add(warranty)
    db.commit()
    db.refresh(product)

    return product


@router.get("/{product_id}", response_model=schemas.ProductResponse)
def get_product_details(product_id: str, db: Session = Depends(get_db)):
    """Get detailed information for a single product."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.warranty:
        product.warranty.status = calculate_warranty_status(product.warranty.end_date)

    return product


@router.put("/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: str, product_in: schemas.ProductUpdate, db: Session = Depends(get_db)
):
    """Update product and warranty details."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product_in.product_name is not None:
        product.product_name = product_in.product_name
    if product_in.serial_number is not None:
        product.serial_number = product_in.serial_number
    if product_in.brand is not None:
        product.brand = product_in.brand
    if product_in.category is not None:
        product.category = product_in.category
    if product_in.purchase_date is not None:
        product.purchase_date = product_in.purchase_date

    # Update warranty if purchase_date or duration_months changed
    if product.warranty:
        if product_in.vendor_name is not None:
            product.warranty.vendor_name = product_in.vendor_name
        if product_in.duration_months is not None:
            product.warranty.duration_months = product_in.duration_months

        start_date = product.purchase_date
        end_date = calculate_end_date(start_date, product.warranty.duration_months)
        product.warranty.start_date = start_date
        product.warranty.end_date = end_date
        product.warranty.status = calculate_warranty_status(end_date)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: str, db: Session = Depends(get_db)):
    """Delete a product registration and associated data."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return None
