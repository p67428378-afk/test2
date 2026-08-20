"""
Module: server.routers.products
Purpose: Products router for registering, listing, and retrieving products.
"""

import calendar
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from server.database import get_db
from server.models import Product, Warranty, Receipt, User
from server.schemas import ProductCreate, ProductResponse, ProductListResponse
from server.auth import get_current_user

router = APIRouter(prefix="/api/v1/products", tags=["Products"])


def add_months(start_date: date, months: int) -> date:
    """Add months to a date, handling month and day overflow cleanly."""
    month = start_date.month - 1 + months
    year = start_date.year + month // 12
    month = month % 12 + 1
    day = min(start_date.day, calendar.monthrange(year, month)[1])
    return date(year, month, day)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Register a new product and calculate warranty details."""
    # Validation: Purchase date cannot be in the future
    if product_in.purchase_date > date.today():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Purchase date cannot be in the future",
        )

    # Create Product
    new_product = Product(
        user_id=current_user.id,
        name=product_in.name,
        serial_number=product_in.serial_number,
        manufacturer=product_in.manufacturer,
        category=product_in.category,
        purchase_date=product_in.purchase_date,
    )
    db.add(new_product)
    db.flush()  # Get product ID

    # Calculate Warranty Expiry and Status
    expiry_date = None
    status_str = "Active"

    if product_in.is_lifetime:
        status_str = "Active"
    else:
        duration = product_in.warranty_duration_months or 0
        expiry_date = add_months(product_in.purchase_date, duration)

        # Calculate status based on expiry date
        remaining_days = (expiry_date - date.today()).days
        if remaining_days <= 0:
            status_str = "Expired"
        elif remaining_days <= 30:
            status_str = "Expiring Soon"
        else:
            status_str = "Active"

    new_warranty = Warranty(
        product_id=new_product.id,
        duration_months=product_in.warranty_duration_months,
        is_lifetime=product_in.is_lifetime,
        expiry_date=expiry_date,
        status=status_str,
    )
    db.add(new_warranty)

    # Link Receipt if receipt_id is provided
    if product_in.receipt_id:
        receipt = db.query(Receipt).filter(Receipt.id == product_in.receipt_id).first()
        if receipt:
            receipt.product_id = new_product.id

    db.commit()
    db.refresh(new_product)
    return new_product


@router.get("", response_model=ProductListResponse)
def list_products(
    status_filter: Optional[str] = Query(None, alias="status"),
    manufacturer: Optional[str] = None,
    category: Optional[str] = None,
    purchase_date: Optional[date] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List, search, and filter registered products for the current user."""
    query = db.query(Product).filter(Product.user_id == current_user.id)

    # Apply filters
    if status_filter:
        query = query.join(Warranty).filter(Warranty.status == status_filter)
    if manufacturer:
        query = query.filter(Product.manufacturer.ilike(f"%{manufacturer}%"))
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if purchase_date:
        query = query.filter(Product.purchase_date == purchase_date)
    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%"))
            | (Product.serial_number.ilike(f"%{search}%"))
            | (Product.manufacturer.ilike(f"%{search}%"))
        )

    # Order by creation date to ensure deterministic ordering
    query = query.order_by(Product.created_at.desc())

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return {"total": total, "items": items}


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve detailed product, warranty, and claim information."""
    product = (
        db.query(Product)
        .filter(Product.id == product_id, Product.user_id == current_user.id)
        .options(
            joinedload(Product.warranty),
            joinedload(Product.receipts),
            joinedload(Product.claims),
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    # Map receipts to a single receipt if present
    receipt = product.receipts[0] if product.receipts else None
    product.receipt = receipt

    # Sort claims chronologically (by claim_date, then created_at)
    sorted_claims = sorted(product.claims, key=lambda c: (c.claim_date, c.created_at))
    product.claims = sorted_claims

    return product
